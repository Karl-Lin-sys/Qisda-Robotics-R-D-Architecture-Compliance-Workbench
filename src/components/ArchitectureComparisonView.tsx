import React, { useState, useMemo } from 'react';
import {
  PEER_REVIEWED_ARCHITECTURES,
  PeerReviewedArchitecture,
} from '../data/roboticsContent';
import {
  computeDebiasedMetrics,
  ConfusionMatrixInput,
} from '../utils/roboticsEngine';
import { ExternalLink, Sliders, CheckCircle2, AlertTriangle } from 'lucide-react';

interface Props {
  toddlerMode: boolean;
}

export const ArchitectureComparisonView: React.FC<Props> = ({ toddlerMode }) => {
  const [subsystemFilter, setSubsystemFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [simInput, setSimInput] = useState<ConfusionMatrixInput>({
    minoritySamples: 200,
    imbalanceRatio: 50,
    truePositiveRate: 0.78,
    falsePositiveRate: 0.015,
    temporalLeakageCoeff: 0.65,
  });

  const filteredArchitectures = useMemo(() => {
    return PEER_REVIEWED_ARCHITECTURES.filter((item) => {
      const matchesSub =
        subsystemFilter === 'ALL' || item.subsystem === subsystemFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.selectedArchitecture.toLowerCase().includes(q) ||
        item.qisdaSpecRequirement.toLowerCase().includes(q) ||
        item.conferenceCitation.toLowerCase().includes(q) ||
        item.officialGithubRepo.toLowerCase().includes(q);
      return matchesSub && matchesQuery;
    });
  }, [subsystemFilter, searchQuery]);

  const metrics = useMemo(() => computeDebiasedMetrics(simInput), [simInput]);

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2">
          <span>Task 01</span>
          <span aria-hidden="true">·</span>
          <span>CVPR / ICCV / ECCV / NeurIPS (2023–2026)</span>
          <span aria-hidden="true">·</span>
          <span>Zero Blog / Non-Peer-Reviewed Sources</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {toddlerMode
            ? "How Our Friendly Robot Picks Its Super-Smart Brain Parts, eh!"
            : '01. Peer-Reviewed Architecture Selection & De-Biased Evaluation Matrix'}
        </h2>
        <p className="mt-2 text-sm text-slate-600 max-w-4xl leading-relaxed">
          {toddlerMode
            ? "Hey there, little buddy! When Qisda builds a helper robot in Taoyuan, it needs laser eyes to see, strong legs to walk, and a fast tummy computer! We only picked the best ideas tested by real robot scientists, and we made sure nobody cheated on the robot's report card, eh!"
            : 'Rigorous architecture selection for Qisda Machine Vision Product Center (機器視覺產品中心) spanning Autonomous Perception/SLAM, Whole-Body Control (USD/NVIDIA Isaac), and Embedded Hardware Co-Design (Jetson/EtherCAT/ROS 2), grounded strictly in peer-reviewed top-tier conferences and high-star official repositories.'}
        </p>
      </div>

      {/* Interactive De-Biased Metric & Leakage Simulator */}
      <section
        aria-label="De-biased evaluation simulator"
        className="bg-white border border-slate-200 rounded-xl p-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Sliders className="w-3.5 h-3.5 text-slate-700" />
              <span>Interactive Statistical Audit</span>
              <span aria-hidden="true">·</span>
              <span>Eliminating Data Leakage, Overfitting & Class Imbalance Bias</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              {toddlerMode
                ? 'No Cheating on the Robot Report Card Simulator, eh!'
                : 'Spatio-Temporal Leakage & Long-Tail Class Imbalance De-Biasing Simulator'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setSimInput({
                  minoritySamples: 200,
                  imbalanceRatio: 65,
                  truePositiveRate: 0.32,
                  falsePositiveRate: 0.01,
                  temporalLeakageCoeff: 0.85,
                })
              }
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              Load Naive Biased Baseline (65:1)
            </button>
            <button
              type="button"
              onClick={() =>
                setSimInput({
                  minoritySamples: 200,
                  imbalanceRatio: 50,
                  truePositiveRate: 0.88,
                  falsePositiveRate: 0.008,
                  temporalLeakageCoeff: 0.0,
                })
              }
              className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              Load Strict Disjoint Protocol
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
          {/* Sliders */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <label htmlFor="slider-imbalance">
                  Class Imbalance Ratio (Majority : Minority Hazard)
                </label>
                <span className="font-mono tabular-nums">{simInput.imbalanceRatio}:1</span>
              </div>
              <input
                id="slider-imbalance"
                type="range"
                min={1}
                max={100}
                step={1}
                value={simInput.imbalanceRatio}
                onChange={(e) =>
                  setSimInput((prev) => ({
                    ...prev,
                    imbalanceRatio: Number(e.target.value),
                  }))
                }
                className="w-full accent-slate-900"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <label htmlFor="slider-tpr">
                  True Minority Hazard Recall (TPR)
                </label>
                <span className="font-mono tabular-nums">
                  {(simInput.truePositiveRate * 100).toFixed(1)}%
                </span>
              </div>
              <input
                id="slider-tpr"
                type="range"
                min={0.05}
                max={0.99}
                step={0.01}
                value={simInput.truePositiveRate}
                onChange={(e) =>
                  setSimInput((prev) => ({
                    ...prev,
                    truePositiveRate: Number(e.target.value),
                  }))
                }
                className="w-full accent-slate-900"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <label htmlFor="slider-leakage">
                  Random Frame-Split Temporal Leakage Coefficient (λ)
                </label>
                <span className="font-mono tabular-nums">
                  {(simInput.temporalLeakageCoeff * 100).toFixed(0)}%
                </span>
              </div>
              <input
                id="slider-leakage"
                type="range"
                min={0}
                max={0.95}
                step={0.05}
                value={simInput.temporalLeakageCoeff}
                onChange={(e) =>
                  setSimInput((prev) => ({
                    ...prev,
                    temporalLeakageCoeff: Number(e.target.value),
                  }))
                }
                className="w-full accent-slate-900"
              />
              <p className="text-xs text-slate-500 mt-1">
                λ = 0%: Geographically & temporally disjoint sequences. λ &gt; 50%: Adjacent 30Hz ROS bag frames leaked across Train/Test.
              </p>
            </div>
          </div>

          {/* Computed Metric Comparison Cards */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-xs text-slate-500">Naive Overall Accuracy</div>
              <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
                {(metrics.naiveAccuracy * 100).toFixed(2)}%
              </div>
              <div className="mt-2 flex items-center gap-1 text-xs text-amber-700">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Biased by majority floor pixels</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-xs text-slate-500">Matthews Correlation (MCC)</div>
              <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
                {metrics.mcc.toFixed(3)}
              </div>
              <div className="mt-2 flex items-center gap-1 text-xs text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Imbalance-invariant ground truth</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-xs text-slate-500">Balanced Accuracy</div>
              <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
                {(metrics.balancedAccuracy * 100).toFixed(2)}%
              </div>
              <div className="mt-2 text-xs text-slate-600">
                Unweighted class recall mean
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-xs text-slate-500">De-Biased PR-AUC</div>
              <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
                {metrics.prAucApprox.toFixed(3)}
              </div>
              <div className="mt-2 text-xs text-slate-600">
                Precision-Recall area on rare hazards
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-xs text-slate-500">True Disjoint F1 Score</div>
              <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
                {(metrics.f1Score * 100).toFixed(1)}%
              </div>
              <div className="mt-2 text-xs text-slate-600">
                Precision: {(metrics.precision * 100).toFixed(1)}%
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-xs text-slate-500">Leakage F1 Inflation (Δ)</div>
              <div className="text-2xl font-bold font-mono tabular-nums text-rose-700 mt-1">
                +{(metrics.leakageInflationDelta * 100).toFixed(1)}%
              </div>
              <div className="mt-2 text-xs text-rose-700">
                Artificial gain from frame leakage
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div
          role="group"
          aria-label="Filter architectures by subsystem"
          className="inline-flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg overflow-x-auto"
        >
          {(
            [
              ['ALL', 'All Subsystems (5)'],
              ['Perception & SLAM', 'Perception & SLAM'],
              ['Locomotion & WBC', 'Locomotion & WBC'],
              ['Hardware & Embedded', 'Hardware & Embedded'],
            ] as const
          ).map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setSubsystemFilter(val)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                subsystemFilter === val
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72">
          <label htmlFor="arch-search" className="sr-only">
            Search peer-reviewed architectures
          </label>
          <input
            id="arch-search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by conference, sensor, or repo..."
            className="w-full px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* Architecture Cards */}
      <div className="space-y-4">
        {filteredArchitectures.map((arch: PeerReviewedArchitecture, index: number) => (
          <article
            key={arch.id}
            className="bg-white border border-slate-200 rounded-xl p-6 transition-colors hover:border-slate-300"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 mb-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-slate-700">
                  0{index + 1}. {arch.subsystem}
                </span>
                <span aria-hidden="true">·</span>
                <span>Qisda Requirement: {arch.qisdaSpecRequirement}</span>
              </div>
              <div className="flex items-center gap-2 font-mono tabular-nums text-slate-600">
                <span>GitHub: {arch.officialGithubRepo}</span>
                <span aria-hidden="true">·</span>
                <span>{arch.githubStars}</span>
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              {arch.selectedArchitecture}
            </h3>

            <p className="text-xs font-medium text-slate-600 mt-1">
              Peer-Reviewed Citation: {arch.conferenceCitation}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4 pt-4 border-t border-slate-100">
              <div className="lg:col-span-8 space-y-3">
                <div>
                  <h4 className="text-xs font-semibold text-slate-900">
                    Technical Rationale & Anti-Overfitting Justification
                  </h4>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    {arch.whySelectedOverAlternatives}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900">
                    De-Biased Benchmark Protocol
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {arch.debiasedEvaluationProtocol}
                  </p>
                </div>

                {/* Canadian Toddler Explanation Callout (Clean all-around border, no thick left bar) */}
                <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-lg">
                  <div className="text-xs font-semibold text-amber-900 mb-1">
                    Canadian Toddler Explainer (Little Beaver’s Workshop, eh!)
                  </div>
                  <p className="text-xs text-amber-950 leading-relaxed">
                    “{arch.toddlerCanadianExplanation}”
                  </p>
                </div>
              </div>

              {/* Tabular Metrics Column */}
              <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col justify-between">
                <div className="text-xs font-semibold text-slate-900 pb-2 border-b border-slate-200">
                  Disjoint Test Metrics (Jetson AGX Orin)
                </div>
                <dl className="divide-y divide-slate-200/70 text-xs my-2">
                  <div className="py-2 flex justify-between">
                    <dt className="text-slate-600">Matthews Corr. (MCC)</dt>
                    <dd className="font-mono tabular-nums font-semibold text-slate-900">
                      {arch.mccScore.toFixed(3)}
                    </dd>
                  </div>
                  <div className="py-2 flex justify-between">
                    <dt className="text-slate-600">Rare-Hazard PR-AUC</dt>
                    <dd className="font-mono tabular-nums font-semibold text-slate-900">
                      {arch.prAucScore.toFixed(3)}
                    </dd>
                  </div>
                  <div className="py-2 flex justify-between">
                    <dt className="text-slate-600">Calibration Error (ECE ↓)</dt>
                    <dd className="font-mono tabular-nums font-semibold text-emerald-700">
                      {arch.eceScore.toFixed(3)}
                    </dd>
                  </div>
                  <div className="py-2 flex justify-between">
                    <dt className="text-slate-600">Jetson Orin Throughput</dt>
                    <dd className="font-mono tabular-nums font-semibold text-slate-900">
                      {arch.jetsonOrinFps} Hz
                    </dd>
                  </div>
                </dl>
                <a
                  href={`https://github.com/${arch.officialGithubRepo.split(' ')[0]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center justify-center gap-1.5 w-full px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-100 transition-colors whitespace-nowrap"
                >
                  <span>Inspect Official GitHub Repo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
