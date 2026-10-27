import React, { useState } from 'react';
import { ROOT_CAUSES_AND_SOLUTIONS } from '../data/roboticsContent';
import { GitBranch, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  toddlerMode: boolean;
}

export const RootCauseSolutionsView: React.FC<Props> = ({ toddlerMode }) => {
  const [policyMode, setPolicyMode] = useState<'MSE_NAIVE' | 'DIFFUSION_CALIBRATED'>(
    'DIFFUSION_CALIBRATED'
  );
  const [ethercatDelayMs, setEthercatDelayMs] = useState<number>(2.0);

  // Compute simulated trajectory outcome for Bimodal Obstacle Avoidance + Sim2Real Delay
  const collisionRate =
    policyMode === 'MSE_NAIVE'
      ? Math.min(92, 48 + ethercatDelayMs * 9.5)
      : Math.max(2.4, 3.2 + (ethercatDelayMs > 3 ? (ethercatDelayMs - 3) * 1.8 : 0));

  const torqueRippleNm =
    policyMode === 'MSE_NAIVE'
      ? 4.2 + ethercatDelayMs * 1.9
      : 1.1 + ethercatDelayMs * 0.25;

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2">
          <span>Task 03</span>
          <span aria-hidden="true">·</span>
          <span>5-Year Peer-Reviewed ML Papers & Solved Official Issue Trackers</span>
          <span aria-hidden="true">·</span>
          <span>Algorithmic Structural Flaws & Sampling / Selection Bias</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {toddlerMode
            ? '3 Tricky Robot Tummy-Aches & 3 Doctor Beaver Fixes, eh!'
            : '03. Root Cause Diagnosis & 3 Theoretically Grounded Solutions'}
        </h2>
        <p className="mt-2 text-sm text-slate-600 max-w-4xl leading-relaxed">
          {toddlerMode
            ? 'Sometimes a robot gets confused because it only practiced in sunny rooms or tried to go left and right at the exact same time—whoopsie! Here are the 3 real reasons why that happens and the 3 super-smart ways we fix them, eh!'
            : 'Eliminating speculative troubleshooting in favor of primary evidence from peer-reviewed ML literature (ICLR, NeurIPS, CVPR, RSS) and resolved upstream framework issue trackers (PyTorch #104322, #91254, NVIDIA IsaacLab #418, ROS 2 rclcpp #1984).'}
        </p>
      </div>

      {/* Interactive Structural Flaw & Sim-to-Real Verification Sandbox */}
      <section
        aria-label="Bimodal Trajectory & Sim-to-Real Simulator"
        className="bg-white border border-slate-200 rounded-xl p-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <GitBranch className="w-3.5 h-3.5 text-slate-700" />
              <span>Interactive Structural Flaw Verification</span>
              <span aria-hidden="true">·</span>
              <span>Bimodal Action Averaging & EtherCAT Actuator Delay</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              {toddlerMode
                ? 'Left-or-Right Hockey Puck Obstacle Test, eh!'
                : 'Bimodal Obstacle Avoidance: L2 MSE Mode-Averaging Flaw vs. Conditional Score Diffusion'}
            </h3>
          </div>

          <div
            role="group"
            aria-label="Policy Formulation Selection"
            className="inline-flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg"
          >
            <button
              type="button"
              onClick={() => setPolicyMode('MSE_NAIVE')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                policyMode === 'MSE_NAIVE'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Naive L2 MSE Policy (Mode Averaging)
            </button>
            <button
              type="button"
              onClick={() => setPolicyMode('DIFFUSION_CALIBRATED')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                policyMode === 'DIFFUSION_CALIBRATED'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Solution 2: Diffusion Policy + Delay FIFO
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <label htmlFor="ethercat-delay-slider">
                  Physical EtherCAT + Joint Stiction Delay (ms)
                </label>
                <span className="font-mono tabular-nums">
                  {ethercatDelayMs.toFixed(1)} ms
                </span>
              </div>
              <input
                id="ethercat-delay-slider"
                type="range"
                min={0}
                max={5}
                step={0.5}
                value={ethercatDelayMs}
                onChange={(e) => setEthercatDelayMs(Number(e.target.value))}
                className="w-full accent-slate-900"
              />
              <p className="text-xs text-slate-500 mt-1">
                Simulates Sim-to-Real gap between un-delayed OpenUSD rigid bodies (0ms) and physical integrated harmonic joints (1.5–4.0ms).
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="text-xs text-slate-500">Obstacle Collision Rate</div>
                <div
                  className={`text-xl font-bold font-mono tabular-nums mt-1 ${
                    collisionRate > 20 ? 'text-rose-700' : 'text-emerald-700'
                  }`}
                >
                  {collisionRate.toFixed(1)}%
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {policyMode === 'MSE_NAIVE'
                    ? 'Averages +y and -y paths into 0'
                    : 'Samples clean unimodal branch'}
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="text-xs text-slate-500">Joint Torque Ripple</div>
                <div className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-1">
                  {torqueRippleNm.toFixed(2)} N·m
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Peak-to-peak harmonic oscillation
                </div>
              </div>
            </div>
          </div>

          {/* Trajectory SVG Diagram */}
          <div className="lg:col-span-7 bg-slate-950 rounded-xl p-4 text-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Top-Down Navigation & Manipulation Trajectory Plane</span>
              <span className="font-mono tabular-nums">
                {policyMode === 'MSE_NAIVE'
                  ? 'E[a|s] = 0.5·a_left + 0.5·a_right (COLLISION)'
                  : 'p_theta(a_0 | s) Denoising Score Trajectory (SAFE)'}
              </span>
            </div>
            <svg
              viewBox="0 0 520 170"
              className="w-full h-40 bg-slate-900/80 rounded-lg border border-slate-800"
              role="img"
              aria-label="Robot bimodal trajectory comparison diagram"
            >
              {/* Grid lines */}
              <line x1="40" y1="85" x2="480" y2="85" stroke="#334155" strokeDasharray="4 4" />
              {/* Start Robot Node */}
              <circle cx="60" cy="85" r="10" fill="#38BDF8" />
              <text x="42" y="112" fill="#94A3B8" fontSize="10" fontFamily="monospace">
                Robot Start
              </text>

              {/* Expert Demonstrations (Left & Right) */}
              <path
                d="M 60 85 Q 250 10, 450 85"
                fill="none"
                stroke="#475569"
                strokeWidth="2"
                strokeDasharray="5 5"
              />
              <path
                d="M 60 85 Q 250 160, 450 85"
                fill="none"
                stroke="#475569"
                strokeWidth="2"
                strokeDasharray="5 5"
              />

              {/* Central Obstacle */}
              <rect
                x="230"
                y="62"
                width="46"
                height="46"
                rx="6"
                fill="#EF4444"
                fillOpacity="0.25"
                stroke="#EF4444"
                strokeWidth="2"
              />
              <text x="234" y="89" fill="#FCA5A5" fontSize="9" fontFamily="monospace">
                HAZARD
              </text>

              {/* Active Policy Trajectory */}
              {policyMode === 'MSE_NAIVE' ? (
                <g>
                  <path
                    d="M 60 85 L 230 85"
                    fill="none"
                    stroke="#F43F5E"
                    strokeWidth="3.5"
                  />
                  <circle cx="230" cy="85" r="7" fill="#F43F5E" />
                  <text x="115" y="74" fill="#FDA4AF" fontSize="10" fontFamily="monospace">
                    MSE Mean Path → Collision!
                  </text>
                </g>
              ) : (
                <g>
                  <path
                    d="M 60 85 Q 250 14, 450 85"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3.5"
                  />
                  <text x="155" y="34" fill="#6EE7B7" fontSize="10" fontFamily="monospace">
                    Diffusion Mode Selection → Clear!
                  </text>
                </g>
              )}

              {/* Goal Node */}
              <circle cx="450" cy="85" r="10" fill="#10B981" />
              <text x="430" y="112" fill="#94A3B8" fontSize="10" fontFamily="monospace">
                Goal Pose
              </text>
            </svg>
          </div>
        </div>
      </section>

      {/* 3 Root Causes & 3 Theoretically Grounded Solutions Cards */}
      <div className="space-y-6">
        {ROOT_CAUSES_AND_SOLUTIONS.map((item, idx) => (
          <article
            key={item.id}
            className="bg-white border border-slate-200 rounded-xl p-6 space-y-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1">
                  <span>Diagnosis 0{idx + 1}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.domain}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
              </div>
              <div className="text-xs font-mono text-slate-600 bg-slate-100 px-3 py-1.5 rounded-md">
                {item.primaryCitationAndIssueRef.split(';')[0]}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Symptom & Structural/Sampling Root Cause */}
              <div className="space-y-4">
                <div className="p-4 bg-rose-50/50 border border-rose-200/80 rounded-lg">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-900 mb-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Observed Engineering Symptom & Structural / Bias Root Cause</span>
                  </div>
                  <p className="text-xs font-medium text-rose-950 mb-2">
                    Symptom: {item.symptomInQisdaContext}
                  </p>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {item.structuralOrSamplingRootCause}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-slate-900">
                    Primary Literature & Resolved Issue Tracker Evidence
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 font-mono">
                    {item.primaryCitationAndIssueRef}
                  </p>
                </div>
              </div>

              {/* Right Column: Theoretical Solution & Mathematical Formulation */}
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50/50 border border-emerald-200/80 rounded-lg">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-900 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{item.theoreticalSolutionTitle}</span>
                  </div>
                  <div className="my-2 p-2.5 bg-slate-900 text-slate-100 rounded-md text-xs font-mono overflow-x-auto">
                    {item.mathematicalFormulation}
                  </div>
                  <p className="text-xs text-emerald-950 font-medium">
                    Verified Impact: {item.verificationMetricImprovement}
                  </p>
                </div>

                <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-lg">
                  <div className="text-xs font-semibold text-amber-900 mb-1">
                    Canadian Toddler Explainer (Doctor Beaver’s Fix, eh!)
                  </div>
                  <p className="text-xs text-amber-950 leading-relaxed">
                    “{item.toddlerCanadianExplanation}”
                  </p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
