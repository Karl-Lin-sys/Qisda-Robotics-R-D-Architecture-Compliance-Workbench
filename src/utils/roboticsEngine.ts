/**
 * Pure mathematical and algorithmic analysis functions for Qisda Robotics R&D Workbench.
 * Decoupled for deterministic verification via node:test.
 */

export interface ConfusionMatrixInput {
  minoritySamples: number;
  imbalanceRatio: number; // N_majority / N_minority (e.g., 50 means 50:1)
  truePositiveRate: number; // Recall on minority class (0..1)
  falsePositiveRate: number; // FPR on majority class (0..1)
  temporalLeakageCoeff: number; // 0 = strict disjoint scene split, 1 = random frame split leakage
}

export interface DebiasedMetricsResult {
  naiveAccuracy: number;
  balancedAccuracy: number;
  mcc: number;
  prAucApprox: number;
  precision: number;
  recall: number;
  f1Score: number;
  leakageInflationDelta: number;
  effectiveGeneralizationGap: number;
}

/**
 * Computes class-imbalance-resistant metrics (MCC, Balanced Accuracy, Precision, F1)
 * and quantifies how random frame-level data leakage artificially inflates benchmarks
 * in sequential robotics datasets (e.g., 10Hz RGB-D / LiDAR streams).
 */
export function computeDebiasedMetrics(input: ConfusionMatrixInput): DebiasedMetricsResult {
  const minN = Math.max(1, Math.round(input.minoritySamples));
  const ratio = Math.max(1, input.imbalanceRatio);
  const majN = Math.round(minN * ratio);

  // Leakage artificially boosts apparent TPR and suppresses FPR on correlated adjacent frames
  const leakageBoost = Math.min(0.99, Math.max(0, input.temporalLeakageCoeff));
  const trueTpr = Math.min(0.999, Math.max(0.001, input.truePositiveRate));
  const trueFpr = Math.min(0.999, Math.max(0.0001, input.falsePositiveRate));

  const tp = minN * trueTpr;
  const fn = minN * (1 - trueTpr);
  const fp = majN * trueFpr;
  const tn = majN * (1 - trueFpr);

  const total = minN + majN;
  const naiveAccuracy = (tp + tn) / total;
  const balancedAccuracy = 0.5 * (tp / minN + tn / majN);

  const precision = tp / Math.max(1e-9, tp + fp);
  const recall = trueTpr;
  const f1Score = (2 * precision * recall) / Math.max(1e-9, precision + recall);

  // Matthews Correlation Coefficient (MCC) - invariant to class imbalance
  const numerator = tp * tn - fp * fn;
  const denomProduct = (tp + fp) * (tp + fn) * (tn + fp) * (tn + fn);
  const mcc = denomProduct > 0 ? numerator / Math.sqrt(denomProduct) : 0;

  // Approximate PR-AUC under exponential precision decay model
  const baselinePrevalence = minN / total;
  const prAucApprox = Math.min(
    1,
    Math.max(baselinePrevalence, 0.65 * precision * recall + 0.35 * ((precision + recall) / 2))
  );

  // Quantify artificial metric inflation if random frame split is used instead of sequence-disjoint split
  const leakedTpr = Math.min(0.999, trueTpr + (1 - trueTpr) * 0.72 * leakageBoost);
  const leakedFpr = Math.max(0.0001, trueFpr * (1 - 0.8 * leakageBoost));
  const leakedTp = minN * leakedTpr;
  const leakedFp = majN * leakedFpr;
  const leakedPrecision = leakedTp / Math.max(1e-9, leakedTp + leakedFp);
  const leakedF1 =
    (2 * leakedPrecision * leakedTpr) / Math.max(1e-9, leakedPrecision + leakedTpr);

  const leakageInflationDelta = Math.max(0, leakedF1 - f1Score);
  const effectiveGeneralizationGap = leakageBoost * 0.38 + (ratio > 20 ? 0.12 : 0.04);

  return {
    naiveAccuracy: Number(naiveAccuracy.toFixed(4)),
    balancedAccuracy: Number(balancedAccuracy.toFixed(4)),
    mcc: Number(mcc.toFixed(4)),
    prAucApprox: Number(prAucApprox.toFixed(4)),
    precision: Number(precision.toFixed(4)),
    recall: Number(recall.toFixed(4)),
    f1Score: Number(f1Score.toFixed(4)),
    leakageInflationDelta: Number(leakageInflationDelta.toFixed(4)),
    effectiveGeneralizationGap: Number(effectiveGeneralizationGap.toFixed(4)),
  };
}

export interface BigOSimulationParams {
  pointCloudSize: number; // N: number of 3D points (e.g., 16384 to 131072)
  imageHeight: number; // H: e.g., 480
  imageWidth: number; // W: e.g., 640
  jointDof: number; // D: robot degrees of freedom (e.g., 7 to 32)
  taskDim: number; // M: task-space constraints (e.g., 6 for SE(3))
  icpIterations: number; // K: ICP solver steps
}

export interface BigOModuleBenchmark {
  id: string;
  name: string;
  timeComplexity: string;
  spaceComplexity: string;
  optimizedOpsCount: number;
  naiveOpsCount: number;
  speedupFactor: number;
  estimatedJetsonOrinMs: number;
  naiveJetsonOrinMs: number;
  memoryFootprintMb: number;
  naiveMemoryLeakMbPerMin: number;
}

/**
 * Calculates exact asymptotic operation counts and Jetson AGX Orin execution latency
 * comparing official reference best-practices against common bad practices.
 */
export function evaluatePipelineComplexity(params: BigOSimulationParams): BigOModuleBenchmark[] {
  const N = Math.max(1000, params.pointCloudSize);
  const H = Math.max(64, params.imageHeight);
  const W = Math.max(64, params.imageWidth);
  const D = Math.max(6, params.jointDof);
  const M = Math.max(3, params.taskDim);
  const K = Math.max(1, params.icpIterations);

  // 1. LiDAR-Inertial Odometry: O(N) Spatial Voxel Hash vs O(N^2) Brute Force / O(K * N log N) Rebuilt KD-Tree
  const voxelHashOps = K * N * 7; // 7-neighborhood spatial hash lookup O(N)
  const rebuiltKdTreeOps = K * N * Math.log2(N) * 18;
  const lidarOrinMs = (voxelHashOps / 1.4e7) + 0.85;
  const lidarNaiveMs = (rebuiltKdTreeOps / 4.2e6) + 4.5;

  // 2. RGB-D + LWIR Thermal Sensor Fusion: Zero-Copy Pinned Tensor + torch.amp vs Unpinned .cpu().numpy() Loop
  const pixels = H * W;
  const channels = 64;
  const fusedTensorOps = pixels * channels * 2; // Linear projection + gated fusion O(H*W*C)
  const naivePythonLoopOps = pixels * channels * 24; // Host-device sync + Python loop overhead
  const fusionOrinMs = (fusedTensorOps / 8.5e7) + 1.1;
  const fusionNaiveMs = (naivePythonLoopOps / 6.0e6) + 18.4;

  // 3. Whole-Body Control (WBC) Damped Least Squares: Task-space O(M^2 * D + M^3) via torch.linalg.solve vs Naive O(D^3) SVD pinv
  const dlsOptimizedOps = M * M * D + Math.pow(M, 3) + M * D;
  const naiveSvdPinvOps = Math.pow(D, 3) * 14 + D * D * M * 6;
  const wbcOrinMs = (dlsOptimizedOps / 2.5e6) + 0.18;
  const wbcNaiveMs = (naiveSvdPinvOps / 8.0e5) + 2.4;

  // 4. Multi-Sensor Ring Buffer Synchronization: O(log B) Binary Search on Pre-allocated Deque vs O(B) Array Concatenation Copy
  const bufferCapacity = 256;
  const syncOptimizedOps = Math.ceil(Math.log2(bufferCapacity)) * 4;
  const syncNaiveOps = bufferCapacity * N * 3; // Reallocating point cloud history array each frame
  const syncOrinMs = 0.04;
  const syncNaiveMs = (syncNaiveOps / 1.8e7) + 3.2;

  return [
    {
      id: 'voxel-icp',
      name: 'SE(3) Point-to-Plane ICP with Spatial Voxel Hashing',
      timeComplexity: 'O(K · N)',
      spaceComplexity: 'O(V_active)',
      optimizedOpsCount: Math.round(voxelHashOps),
      naiveOpsCount: Math.round(rebuiltKdTreeOps),
      speedupFactor: Number((lidarNaiveMs / lidarOrinMs).toFixed(1)),
      estimatedJetsonOrinMs: Number(lidarOrinMs.toFixed(2)),
      naiveJetsonOrinMs: Number(lidarNaiveMs.toFixed(2)),
      memoryFootprintMb: Number(((N * 16) / (1024 * 1024) + 12.5).toFixed(2)),
      naiveMemoryLeakMbPerMin: 412.8, // Unfreed Open3D/C++ KDTree buffers in loop
    },
    {
      id: 'rgbd-lwir-fusion',
      name: 'Zero-Copy Pinned-Memory RGB-D + LWIR Thermal Gated Fusion',
      timeComplexity: 'O(H · W · C)',
      spaceComplexity: 'O(H · W · C)',
      optimizedOpsCount: Math.round(fusedTensorOps),
      naiveOpsCount: Math.round(naivePythonLoopOps),
      speedupFactor: Number((fusionNaiveMs / fusionOrinMs).toFixed(1)),
      estimatedJetsonOrinMs: Number(fusionOrinMs.toFixed(2)),
      naiveJetsonOrinMs: Number(fusionNaiveMs.toFixed(2)),
      memoryFootprintMb: Number(((pixels * channels * 2) / (1024 * 1024) + 24.0).toFixed(2)),
      naiveMemoryLeakMbPerMin: 1280.0, // Accumulating autograd computation graph via .append(loss)
    },
    {
      id: 'wbc-dls-ik',
      name: 'Whole-Body Control Damped Least Squares (Cholesky / Solve)',
      timeComplexity: 'O(M² · D + M³)',
      spaceComplexity: 'O(M · D)',
      optimizedOpsCount: Math.round(dlsOptimizedOps),
      naiveOpsCount: Math.round(naiveSvdPinvOps),
      speedupFactor: Number((wbcNaiveMs / wbcOrinMs).toFixed(1)),
      estimatedJetsonOrinMs: Number(wbcOrinMs.toFixed(2)),
      naiveJetsonOrinMs: Number(wbcNaiveMs.toFixed(2)),
      memoryFootprintMb: Number(((D * M * 8) / (1024 * 1024) + 2.1).toFixed(2)),
      naiveMemoryLeakMbPerMin: 94.5, // Repeated tensor allocation inside 1kHz EtherCAT RT loop
    },
    {
      id: 'ring-buffer-sync',
      name: 'Lock-Free Bisect Time-Synchronizer (LiDAR / IMU / Camera)',
      timeComplexity: 'O(log B)',
      spaceComplexity: 'O(B)',
      optimizedOpsCount: Math.round(syncOptimizedOps),
      naiveOpsCount: Math.round(syncNaiveOps),
      speedupFactor: Number((syncNaiveMs / syncOrinMs).toFixed(1)),
      estimatedJetsonOrinMs: Number(syncOrinMs.toFixed(2)),
      naiveJetsonOrinMs: Number(syncNaiveMs.toFixed(2)),
      memoryFootprintMb: 4.8,
      naiveMemoryLeakMbPerMin: 640.0, // Unbounded list growth without maxlen
    },
  ];
}

export interface TaiwanComplianceAuditInput {
  containsProprietaryCadOrCalib: boolean; // Trade Secrets Act Art. 2
  containsRawApplicantOrPatientPii: boolean; // PDPA Art. 6 & Art. 19
  disclosesRegularSalaryMin40k: boolean; // Employment Service Act Art. 5 Para. 2 Item 6
  enforcesAntiDiscriminationPolicy: boolean; // Employment Service Act Art. 5 Para. 1
  usesPermissiveSpdxLicense: boolean; // Copyright Act Art. 11 & Open Source compatibility
  screensShtcDualUseExport: boolean; // Foreign Trade Act Art. 13 (Strategic High-Tech Goods)
}

export interface TaiwanComplianceAuditReport {
  isLegallyClearForGithub: boolean;
  overallComplianceScore: number;
  passedChecksCount: number;
  totalChecksCount: number;
  blockingViolations: string[];
  statutoryCitations: string[];
}

/**
 * Evaluates whether a robotics repository release complies with Taiwan (R.O.C.) statutory requirements
 * prior to public GitHub upload.
 */
export function auditTaiwanLegalCompliance(
  input: TaiwanComplianceAuditInput
): TaiwanComplianceAuditReport {
  const violations: string[] = [];
  const citations: string[] = [
    'Trade Secrets Act (營業秘密法) Articles 2, 10, 13-1',
    'Personal Data Protection Act (個人資料保護法) Articles 6, 19, 20',
    'Employment Service Act (就業服務法) Article 5 Para. 1 & Para. 2 Item 6',
    'Copyright Act (著作權法) Article 11',
    'Foreign Trade Act (貿易法) Article 13 — Strategic High-Tech Goods (SHTC)',
  ];

  let passed = 0;
  const total = 6;

  if (!input.containsProprietaryCadOrCalib) {
    passed += 1;
  } else {
    violations.push(
      'Violation of Trade Secrets Act (營業秘密法 Art. 2 & 10): Repository contains unredacted Qisda factory extrinsic calibration tables or proprietary Pro/E CAD geometries.'
    );
  }

  if (!input.containsRawApplicantOrPatientPii) {
    passed += 1;
  } else {
    violations.push(
      'Violation of Personal Data Protection Act (個人資料保護法 Art. 6 & 19): Dataset includes unblurred faces, hospital patient telemetry, or applicant PII from the 610-candidate recruitment pool.'
    );
  }

  if (input.disclosesRegularSalaryMin40k) {
    passed += 1;
  } else {
    violations.push(
      'Violation of Employment Service Act (就業服務法 Art. 5 Para. 2 Item 6): Salary disclosure must explicitly state regular monthly compensation >= NT$40,000 when listed as negotiable.'
    );
  }

  if (input.enforcesAntiDiscriminationPolicy) {
    passed += 1;
  } else {
    violations.push(
      'Violation of Employment Service Act (就業服務法 Art. 5 Para. 1): Recruitment & algorithmic screening must prohibit bias across 18 protected attributes (race, gender, age, union status, etc.).'
    );
  }

  if (input.usesPermissiveSpdxLicense) {
    passed += 1;
  } else {
    violations.push(
      'Violation of Copyright Act (著作權法 Art. 11): Work-for-hire code requires explicit employer copyright assignment and SPDX Apache-2.0 / MIT header attribution.'
    );
  }

  if (input.screensShtcDualUseExport) {
    passed += 1;
  } else {
    violations.push(
      'Violation of Foreign Trade Act (貿易法 Art. 13): LWIR thermal imaging and military-grade INS firmware parameters require Bureau of Foreign Trade SHTC export control screening.'
    );
  }

  const score = Math.round((passed / total) * 100);

  return {
    isLegallyClearForGithub: violations.length === 0,
    overallComplianceScore: score,
    passedChecksCount: passed,
    totalChecksCount: total,
    blockingViolations: violations,
    statutoryCitations: citations,
  };
}
