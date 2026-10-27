import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeDebiasedMetrics,
  evaluatePipelineComplexity,
  auditTaiwanLegalCompliance,
} from './roboticsEngine';

test('computeDebiasedMetrics exposes naive accuracy bias under 50:1 class imbalance', () => {
  const result = computeDebiasedMetrics({
    minoritySamples: 100,
    imbalanceRatio: 50, // 5000 majority samples, 100 minority samples
    truePositiveRate: 0.25, // Poor minority recall
    falsePositiveRate: 0.01, // Low majority false positive rate
    temporalLeakageCoeff: 0.8,
  });

  // Naive accuracy looks deceptively high (> 97%) despite failing 75% of minority hazards
  assert.ok(result.naiveAccuracy > 0.97, `Expected naiveAccuracy > 0.97, got ${result.naiveAccuracy}`);
  // Balanced accuracy and MCC objectively capture the poor minority detection
  assert.ok(result.balancedAccuracy < 0.65, `Expected balancedAccuracy < 0.65, got ${result.balancedAccuracy}`);
  assert.ok(result.mcc < 0.45, `Expected mcc < 0.45, got ${result.mcc}`);
  // Temporal leakage inflates F1 significantly
  assert.ok(result.leakageInflationDelta > 0.1, `Expected leakageInflationDelta > 0.1, got ${result.leakageInflationDelta}`);
});

test('evaluatePipelineComplexity demonstrates asymptotic speedup and zero memory leak', () => {
  const benchmarks = evaluatePipelineComplexity({
    pointCloudSize: 65536,
    imageHeight: 480,
    imageWidth: 640,
    jointDof: 24,
    taskDim: 6,
    icpIterations: 15,
  });

  assert.equal(benchmarks.length, 4);
  for (const mod of benchmarks) {
    assert.ok(mod.speedupFactor > 1.0, `Expected speedup > 1.0 for ${mod.id}`);
    assert.ok(mod.estimatedJetsonOrinMs < mod.naiveJetsonOrinMs);
    assert.ok(mod.naiveMemoryLeakMbPerMin > 0);
  }
});

test('auditTaiwanLegalCompliance passes only when all 6 statutory conditions are met', () => {
  const passing = auditTaiwanLegalCompliance({
    containsProprietaryCadOrCalib: false,
    containsRawApplicantOrPatientPii: false,
    disclosesRegularSalaryMin40k: true,
    enforcesAntiDiscriminationPolicy: true,
    usesPermissiveSpdxLicense: true,
    screensShtcDualUseExport: true,
  });

  assert.equal(passing.isLegallyClearForGithub, true);
  assert.equal(passing.overallComplianceScore, 100);
  assert.equal(passing.blockingViolations.length, 0);

  const failing = auditTaiwanLegalCompliance({
    containsProprietaryCadOrCalib: true,
    containsRawApplicantOrPatientPii: false,
    disclosesRegularSalaryMin40k: true,
    enforcesAntiDiscriminationPolicy: true,
    usesPermissiveSpdxLicense: true,
    screensShtcDualUseExport: false,
  });

  assert.equal(failing.isLegallyClearForGithub, false);
  assert.equal(failing.blockingViolations.length, 2);
});
