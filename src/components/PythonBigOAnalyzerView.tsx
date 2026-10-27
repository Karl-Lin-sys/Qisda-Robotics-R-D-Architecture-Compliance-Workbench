import React, { useState, useMemo } from 'react';
import { OFFICIAL_PYTHON_MODULES } from '../data/roboticsContent';
import {
  evaluatePipelineComplexity,
  BigOSimulationParams,
} from '../utils/roboticsEngine';
import { Copy, Check, Cpu, ShieldCheck } from 'lucide-react';

interface Props {
  toddlerMode: boolean;
}

export const PythonBigOAnalyzerView: React.FC<Props> = ({ toddlerMode }) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>(
    OFFICIAL_PYTHON_MODULES[0].id
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [simParams, setSimParams] = useState<BigOSimulationParams>({
    pointCloudSize: 65536,
    imageHeight: 480,
    imageWidth: 640,
    jointDof: 24,
    taskDim: 6,
    icpIterations: 12,
  });

  const activeModule = useMemo(
    () =>
      OFFICIAL_PYTHON_MODULES.find((m) => m.id === selectedModuleId) ||
      OFFICIAL_PYTHON_MODULES[0],
    [selectedModuleId]
  );

  const benchmarks = useMemo(
    () => evaluatePipelineComplexity(simParams),
    [simParams]
  );

  const totalOptimizedMs = useMemo(
    () =>
      benchmarks.reduce((acc, item) => acc + item.estimatedJetsonOrinMs, 0),
    [benchmarks]
  );
  const totalNaiveMs = useMemo(
    () => benchmarks.reduce((acc, item) => acc + item.naiveJetsonOrinMs, 0),
    [benchmarks]
  );
  const totalAvoidedLeakMb = useMemo(
    () =>
      benchmarks.reduce((acc, item) => acc + item.naiveMemoryLeakMbPerMin, 0),
    [benchmarks]
  );

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2">
          <span>Task 02</span>
          <span aria-hidden="true">·</span>
          <span>PyTorch 2.4 / OpenCV 4.10 / Python 3.12 Official Reference Only</span>
          <span aria-hidden="true">·</span>
          <span>Asymptotic Big-O & Memory Leak Elimination</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {toddlerMode
            ? 'Super-Tidy Robot Code That Never Drops Toys on the Floor, eh!'
            : '02. Official Reference Python Implementation & Big-O Complexity Verification'}
        </h2>
        <p className="mt-2 text-sm text-slate-600 max-w-4xl leading-relaxed">
          {toddlerMode
            ? 'If you leave Lego blocks all over the living room carpet, pretty soon nobody can walk, eh! Our Python code puts every single block back in its special box right away (0 MB/min memory leak) and uses clever shortcuts (Big-O math) so the robot never gets tired!'
            : 'Generated exclusively from official PyTorch, OpenCV, and Python standard library reference documentation. Eliminates common robotics memory leaks (unbounded sensor lists, autograd graph accumulation, unpinned DMA transfers, and per-frame SVD matrix inversions).'}
        </p>
      </div>

      {/* Interactive Big-O & Jetson AGX Orin Complexity Calculator */}
      <section
        aria-label="Big-O Complexity Simulator"
        className="bg-white border border-slate-200 rounded-xl p-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Cpu className="w-3.5 h-3.5 text-slate-700" />
              <span>Interactive Hardware-Software Complexity Profiler</span>
              <span aria-hidden="true">·</span>
              <span>Target: NVIDIA Jetson AGX Orin (64GB Unified Memory)</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              {toddlerMode
                ? 'How Fast Can Our Robot Count Its Laser Dots, eh?'
                : 'Real-Time Big-O Asymptotic Operation & Memory Leak Profiler'}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5">
            <div>
              <span className="text-slate-500">Total Frame Latency: </span>
              <span className="font-mono tabular-nums font-bold text-emerald-700">
                {totalOptimizedMs.toFixed(2)} ms
              </span>
              <span className="text-slate-400"> vs </span>
              <span className="font-mono tabular-nums text-rose-700 line-through">
                {totalNaiveMs.toFixed(1)} ms
              </span>
            </div>
            <div>
              <span className="text-slate-500">Memory Leak Avoided: </span>
              <span className="font-mono tabular-nums font-bold text-slate-900">
                {totalAvoidedLeakMb.toFixed(1)} MB/min
              </span>
            </div>
          </div>
        </div>

        {/* Parameter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-5 border-b border-slate-100">
          <div>
            <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
              <label htmlFor="param-points">LiDAR Point Cloud Size (N)</label>
              <span className="font-mono tabular-nums">
                {simParams.pointCloudSize.toLocaleString()} pts
              </span>
            </div>
            <input
              id="param-points"
              type="range"
              min={16384}
              max={131072}
              step={16384}
              value={simParams.pointCloudSize}
              onChange={(e) =>
                setSimParams((p) => ({
                  ...p,
                  pointCloudSize: Number(e.target.value),
                }))
              }
              className="w-full accent-slate-900"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
              <label htmlFor="param-dof">Whole-Body Joint Degrees of Freedom (D)</label>
              <span className="font-mono tabular-nums">{simParams.jointDof} DOF</span>
            </div>
            <input
              id="param-dof"
              type="range"
              min={7}
              max={36}
              step={1}
              value={simParams.jointDof}
              onChange={(e) =>
                setSimParams((p) => ({
                  ...p,
                  jointDof: Number(e.target.value),
                }))
              }
              className="w-full accent-slate-900"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
              <label htmlFor="param-icp">SE(3) ICP Solver Iterations (K)</label>
              <span className="font-mono tabular-nums">{simParams.icpIterations} steps</span>
            </div>
            <input
              id="param-icp"
              type="range"
              min={4}
              max={30}
              step={2}
              value={simParams.icpIterations}
              onChange={(e) =>
                setSimParams((p) => ({
                  ...p,
                  icpIterations: Number(e.target.value),
                }))
              }
              className="w-full accent-slate-900"
            />
          </div>
        </div>

        {/* High-Density Tabular Comparison Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-600">
                <th className="py-2.5 pr-4">Pipeline Function</th>
                <th className="py-2.5 px-3">Time Complexity</th>
                <th className="py-2.5 px-3">Space Complexity</th>
                <th className="py-2.5 px-3 text-right">Optimized Ops</th>
                <th className="py-2.5 px-3 text-right">Naive Anti-Pattern Ops</th>
                <th className="py-2.5 px-3 text-right">Jetson Orin (ms)</th>
                <th className="py-2.5 pl-3 text-right">Speedup</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 text-xs">
              {benchmarks.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="py-3 pr-4 font-medium text-slate-900">
                    {row.name}
                  </td>
                  <td className="py-3 px-3 font-mono tabular-nums text-slate-700">
                    {row.timeComplexity}
                  </td>
                  <td className="py-3 px-3 font-mono tabular-nums text-slate-600">
                    {row.spaceComplexity}
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-900">
                    {row.optimizedOpsCount.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-500">
                    {row.naiveOpsCount.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-emerald-700">
                    {row.estimatedJetsonOrinMs.toFixed(2)} ms
                  </td>
                  <td className="py-3 pl-3 text-right font-mono tabular-nums font-semibold text-slate-900">
                    {row.speedupFactor}x
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Code Module Selector & Viewer */}
      <section
        aria-label="Official Reference Python Implementation"
        className="bg-white border border-slate-200 rounded-xl overflow-hidden"
      >
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div
            role="tablist"
            aria-label="Python reference modules"
            className="flex flex-wrap items-center gap-1.5"
          >
            {OFFICIAL_PYTHON_MODULES.map((mod) => (
              <button
                key={mod.id}
                role="tab"
                aria-selected={selectedModuleId === mod.id}
                type="button"
                onClick={() => setSelectedModuleId(mod.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedModuleId === mod.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {mod.title.split('(')[0].trim()}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => handleCopyCode(activeModule.id, activeModule.code)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0"
          >
            {copiedId === activeModule.id ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied Reference Code</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Python Code</span>
              </>
            )}
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-800">
              Official Source: {activeModule.frameworkSource}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              Time: {activeModule.bigOTime}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              Space: {activeModule.bigOSpace}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-xs font-semibold text-slate-900 mb-1">
                Asymptotic Big-O Proof
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {activeModule.complexityProof}
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Memory Leak & Anti-Pattern Eliminated</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {activeModule.antiPatternEliminated}
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-lg">
            <div className="text-xs font-semibold text-amber-900 mb-1">
              Canadian Toddler Explainer (Little Beaver’s Code Story, eh!)
            </div>
            <p className="text-xs text-amber-950 leading-relaxed">
              “{activeModule.toddlerSummary}”
            </p>
          </div>

          <div className="relative">
            <pre className="p-4 bg-slate-950 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
              <code>{activeModule.code}</code>
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
};
