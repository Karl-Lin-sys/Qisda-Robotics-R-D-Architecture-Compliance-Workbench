/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArchitectureComparisonView } from './components/ArchitectureComparisonView';
import { PythonBigOAnalyzerView } from './components/PythonBigOAnalyzerView';
import { RootCauseSolutionsView } from './components/RootCauseSolutionsView';
import { NistAndTaiwanComplianceView } from './components/NistAndTaiwanComplianceView';
import { BookOpen, Code2, GitCommit, ShieldCheck, Sparkles } from 'lucide-react';

type ActiveSection = 'architecture' | 'python-bigo' | 'root-causes' | 'nist-taiwan';

export default function App() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('architecture');
  const [toddlerMode, setToddlerMode] = useState<boolean>(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveSection('architecture');
            }}
            className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            Qisda Robotics R&amp;D Workbench
          </a>

          {/* Zone 2: 4 concise single-line text navigation links */}
          <nav
            aria-label="Primary sections"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
          >
            <button
              type="button"
              onClick={() => setActiveSection('architecture')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeSection === 'architecture'
                  ? 'border-slate-900 text-slate-900 font-semibold'
                  : 'border-transparent'
              }`}
            >
              Architecture Matrix
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('python-bigo')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeSection === 'python-bigo'
                  ? 'border-slate-900 text-slate-900 font-semibold'
                  : 'border-transparent'
              }`}
            >
              Python &amp; Big-O
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('root-causes')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeSection === 'root-causes'
                  ? 'border-slate-900 text-slate-900 font-semibold'
                  : 'border-transparent'
              }`}
            >
              Root Causes
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('nist-taiwan')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeSection === 'nist-taiwan'
                  ? 'border-slate-900 text-slate-900 font-semibold'
                  : 'border-transparent'
              }`}
            >
              NIST &amp; Taiwan Law
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setActiveSection('nist-taiwan')}
              className="px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
            >
              Export GitHub Bundle
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main id="top" className="flex-1 max-w-7xl w-full mx-auto px-6 py-6 space-y-6">
        {/* Executive Context & Workspace Mode Toolbar */}
        <section
          aria-label="Qisda Robotics R&D Specification Overview"
          className="bg-white border border-slate-200 rounded-xl p-5"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>佳世達科技股份有限公司 (Qisda Corporation)</span>
                <span aria-hidden="true">·</span>
                <span>機器人研究開發工程師【機器視覺產品中心】</span>
                <span aria-hidden="true">·</span>
                <span>桃園市龜山區山鶯路157號</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 text-balance">
                {toddlerMode
                  ? "Little Beaver's Robot Workshop: Eyes, Legs, Safety Locks & Taiwan Rules, eh!"
                  : 'Autonomous Robotics Perception, Whole-Body Control & NIST CSF 2.0 Reference System'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {toddlerMode
                  ? "Welcome to our cosy Canadian-friendly robot lab, eh! Every button here explains super-fancy robot science so even a 4-year-old helper in mittens can understand how our robot sees in the dark, keeps its balance, and follows Taiwan's laws!"
                  : 'Synthesizing CVPR/ICCV/ECCV/NeurIPS (2023–2026) peer-reviewed architectures, official PyTorch/OpenCV/Python Big-O reference code, structural & sampling bias root-cause fixes, NIST CSF 2.0 security controls, and Taiwan (R.O.C.) statutory GitHub compliance.'}
              </p>
            </div>

            {/* Interactive Canadian Toddler Mode Switch (Workspace Toolbar) */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-1.5 shrink-0">
              <button
                type="button"
                aria-pressed={toddlerMode}
                onClick={() => setToddlerMode((prev) => !prev)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                  toddlerMode
                    ? 'bg-amber-500 text-slate-950 border-amber-600'
                    : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {toddlerMode
                    ? 'Canadian Toddler Mode: ON (Eh!)'
                    : 'Toggle Canadian Toddler Mode (Eh!)'}
                </span>
              </button>
              <span className="text-xs text-slate-500">
                Switches headlines &amp; callouts to toddler-friendly Canadian English
              </span>
            </div>
          </div>

          {/* 4-Column Target Platform Spec Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg">
              <div className="text-xs text-slate-500">01. Optical &amp; SLAM Stack</div>
              <div className="text-xs font-semibold text-slate-900 mt-0.5">
                LiDAR · RGB-D · LWIR · IMU
              </div>
              <div className="text-xs font-mono tabular-nums text-slate-600 mt-0.5">
                100 Hz SE(3) Odometry / CMX Fusion
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg">
              <div className="text-xs text-slate-500">02. Motion &amp; Sim-to-Real</div>
              <div className="text-xs font-semibold text-slate-900 mt-0.5">
                NVIDIA Isaac · OpenUSD · Pro/E
              </div>
              <div className="text-xs font-mono tabular-nums text-slate-600 mt-0.5">
                Diffusion Policy + 500 Hz WBC QP
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg">
              <div className="text-xs text-slate-500">03. Embedded &amp; Real-Time Bus</div>
              <div className="text-xs font-semibold text-slate-900 mt-0.5">
                Jetson Orin · EtherCAT · ROS 2
              </div>
              <div className="text-xs font-mono tabular-nums text-slate-600 mt-0.5">
                Zero-Copy NITROS / &lt;50µs Jitter
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg">
              <div className="text-xs text-slate-500">04. Governance &amp; Recruitment</div>
              <div className="text-xs font-semibold text-slate-900 mt-0.5">
                NIST CSF 2.0 · Taiwan R.O.C. Law
              </div>
              <div className="text-xs font-mono tabular-nums text-slate-600 mt-0.5">
                17 Openings / 610 Applicants De-Biased
              </div>
            </div>
          </div>

          {/* Task Navigation Bar */}
          <div
            role="tablist"
            aria-label="Deliverable Task Tabs"
            className="grid grid-cols-2 lg:grid-cols-4 gap-2 pt-4 mt-4 border-t border-slate-200"
          >
            <button
              role="tab"
              aria-selected={activeSection === 'architecture'}
              type="button"
              onClick={() => setActiveSection('architecture')}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-semibold border transition-colors text-left ${
                activeSection === 'architecture'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span className="truncate">01. Top-Conf Architectures</span>
            </button>

            <button
              role="tab"
              aria-selected={activeSection === 'python-bigo'}
              type="button"
              onClick={() => setActiveSection('python-bigo')}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-semibold border transition-colors text-left ${
                activeSection === 'python-bigo'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Code2 className="w-4 h-4 shrink-0" />
              <span className="truncate">02. Official Python &amp; Big-O</span>
            </button>

            <button
              role="tab"
              aria-selected={activeSection === 'root-causes'}
              type="button"
              onClick={() => setActiveSection('root-causes')}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-semibold border transition-colors text-left ${
                activeSection === 'root-causes'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <GitCommit className="w-4 h-4 shrink-0" />
              <span className="truncate">03. Root Causes &amp; 3 Solutions</span>
            </button>

            <button
              role="tab"
              aria-selected={activeSection === 'nist-taiwan'}
              type="button"
              onClick={() => setActiveSection('nist-taiwan')}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-semibold border transition-colors text-left ${
                activeSection === 'nist-taiwan'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span className="truncate">04. NIST CSF 2.0 &amp; Taiwan Law</span>
            </button>
          </div>
        </section>

        {/* Active Task Viewport */}
        {activeSection === 'architecture' && (
          <ArchitectureComparisonView toddlerMode={toddlerMode} />
        )}
        {activeSection === 'python-bigo' && (
          <PythonBigOAnalyzerView toddlerMode={toddlerMode} />
        )}
        {activeSection === 'root-causes' && (
          <RootCauseSolutionsView toddlerMode={toddlerMode} />
        )}
        {activeSection === 'nist-taiwan' && (
          <NistAndTaiwanComplianceView toddlerMode={toddlerMode} />
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="bg-white border-t border-slate-200 px-6 py-5 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            Qisda Robotics R&amp;D Reference Architecture · NIST CSF 2.0 · Taiwan (R.O.C.) Statutory Compliance
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveSection('architecture')}
              className="hover:text-slate-900 transition-colors"
            >
              Benchmarks
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('python-bigo')}
              className="hover:text-slate-900 transition-colors"
            >
              Big-O Reference
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('nist-taiwan')}
              className="hover:text-slate-900 transition-colors"
            >
              Taiwan Legal Audit
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
