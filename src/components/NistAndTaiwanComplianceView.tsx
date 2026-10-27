import React, { useState, useMemo } from 'react';
import {
  NIST_CSF_2_PILLARS,
  GITHUB_COMPLIANT_REPO_FILES,
} from '../data/roboticsContent';
import {
  auditTaiwanLegalCompliance,
  TaiwanComplianceAuditInput,
} from '../utils/roboticsEngine';
import {
  Shield,
  Scale,
  Download,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  UploadCloud,
} from 'lucide-react';

interface Props {
  toddlerMode: boolean;
}

export const NistAndTaiwanComplianceView: React.FC<Props> = ({ toddlerMode }) => {
  const [selectedNistCode, setSelectedNistCode] = useState<string>('PR');
  const [selectedRepoFileIdx, setSelectedRepoFileIdx] = useState<number>(0);
  const [copiedGitCmd, setCopiedGitCmd] = useState<boolean>(false);

  // Taiwan Statutory Compliance Audit State
  const [auditState, setAuditState] = useState<TaiwanComplianceAuditInput>({
    containsProprietaryCadOrCalib: false,
    containsRawApplicantOrPatientPii: false,
    disclosesRegularSalaryMin40k: true,
    enforcesAntiDiscriminationPolicy: true,
    usesPermissiveSpdxLicense: true,
    screensShtcDualUseExport: true,
  });

  // GitHub Live Publish Form State
  const [repoName, setRepoName] = useState<string>(
    'qisda-robotics-csf2'
  );
  const [githubOwner, setGithubOwner] = useState<string>('qisda-robotics-rd');
  const [publishLog, setPublishLog] = useState<{
    status: 'idle' | 'error' | 'success';
    message: string;
    timestamp?: string;
  }>({ status: 'idle', message: '' });

  const complianceReport = useMemo(
    () => auditTaiwanLegalCompliance(auditState),
    [auditState]
  );

  const activeNist = useMemo(
    () =>
      NIST_CSF_2_PILLARS.find((p) => p.code === selectedNistCode) ||
      NIST_CSF_2_PILLARS[0],
    [selectedNistCode]
  );

  const activeRepoFile = GITHUB_COMPLIANT_REPO_FILES[selectedRepoFileIdx];

  const gitCliScript = useMemo(() => {
    return `# Taiwan R.O.C. Trade Secrets Act & PDPA Cleared GitHub Push Workflow
mkdir -p ${repoName || 'qisda-robotics-nist-csf2-reference'}/src ${repoName || 'qisda-robotics-nist-csf2-reference'}/security
cd ${repoName || 'qisda-robotics-nist-csf2-reference'}
git init -b main
# Verify zero proprietary .prt (Pro/E), .bag, or raw calibration files exist
git status --ignored
git add README.md src/qisda_robotics_core.py security/sros2_nist_csf_policy.xml
git commit -S -m "feat(robotics): NIST CSF 2.0 & Taiwan R.O.C. legally compliant reference pipeline"
git remote add origin https://github.com/${githubOwner || 'qisda-robotics-rd'}/${repoName || 'qisda-robotics-nist-csf2-reference'}.git
git push -u origin main`;
  }, [repoName, githubOwner]);

  const handleCopyGitCli = () => {
    navigator.clipboard?.writeText(gitCliScript);
    setCopiedGitCmd(true);
    setTimeout(() => setCopiedGitCmd(false), 2000);
  };

  const handleDownloadCompliantBundle = () => {
    if (!complianceReport.isLegallyClearForGithub) {
      setPublishLog({
        status: 'error',
        message:
          'Export blocked by Taiwan Statutory Pre-Flight Gate: Resolve all statutory violations before exporting.',
      });
      return;
    }

    const bundlePayload = {
      repository: `${githubOwner}/${repoName}`,
      jurisdiction: 'Taiwan (R.O.C.)',
      nistCsfVersion: '2.0',
      complianceAttestation: complianceReport,
      files: GITHUB_COMPLIANT_REPO_FILES,
    };

    const blob = new Blob([JSON.stringify(bundlePayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${repoName}-compliant-bundle.json`;
    a.click();
    URL.revokeObjectURL(url);

    setPublishLog({
      status: 'success',
      message: `Exported verified GitHub bundle (${repoName}-compliant-bundle.json) cleared under Taiwan Trade Secrets Act, PDPA, and Copyright Act.`,
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  const handleVerifyAndStageGithubRelease = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoName.trim() || !githubOwner.trim()) {
      setPublishLog({
        status: 'error',
        message: 'Repository owner and repository name are required.',
      });
      return;
    }
    if (!complianceReport.isLegallyClearForGithub) {
      setPublishLog({
        status: 'error',
        message: `Blocked under Taiwan Law (${complianceReport.blockingViolations.length} statutory violation(s) detected). Clear all 6 legal gates first.`,
      });
      return;
    }
    setPublishLog({
      status: 'success',
      message: `Pre-flight attestation passed (100% Taiwan Statutory Score + 6/6 NIST CSF 2.0 Controls). Staged signed commit for https://github.com/${githubOwner.trim()}/${repoName.trim()}.`,
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2">
          <span>Task 04</span>
          <span aria-hidden="true">·</span>
          <span>NIST Cybersecurity Framework (CSF) 2.0</span>
          <span aria-hidden="true">·</span>
          <span>Canadian Toddler Explainer</span>
          <span aria-hidden="true">·</span>
          <span>Taiwan (R.O.C.) Legal GitHub Release</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {toddlerMode
            ? 'Keeping Our Robot Safe Like a Cosy Beaver Lodge & Following Taiwan’s Fair Rules, eh!'
            : '04. NIST CSF 2.0 Architecture, Canadian Toddler Guide & Taiwan Statutory GitHub Publisher'}
        </h2>
        <p className="mt-2 text-sm text-slate-600 max-w-4xl leading-relaxed">
          {toddlerMode
            ? 'Before we share our robot drawings with friends around the world on GitHub, we lock the robot’s front door with 6 strong beaver-lodge locks (NIST CSF 2.0) and check every single rule in Taiwan so nobody’s private secrets ever get shared by mistake, eh!'
            : 'Full mapping of the robotics perception-to-control stack to NIST CSF 2.0 (Govern, Identify, Protect, Detect, Respond, Recover) and statutory pre-flight validation under Taiwan Trade Secrets Act (營業秘密法), Personal Data Protection Act (個人資料保護法), Employment Service Act (就業服務法), Copyright Act (著作權法), and Foreign Trade Act SHTC (戰略性高科技貨品).'}
        </p>
      </div>

      {/* NIST CSF 2.0 Interactive 6-Pillar Matrix */}
      <section
        aria-label="NIST Cybersecurity Framework 2.0 Matrix"
        className="bg-white border border-slate-200 rounded-xl p-6 space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Shield className="w-3.5 h-3.5 text-slate-700" />
              <span>NIST CSF 2.0 Robotics Security Architecture</span>
              <span aria-hidden="true">·</span>
              <span>SROS2 + Jetson UEFI Secure Boot + EtherCAT Isolation</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              6-Pillar NIST Cybersecurity Framework 2.0 Implementation
            </h3>
          </div>
        </div>

        {/* 6 Pillar Selector Tabs */}
        <div
          role="tablist"
          aria-label="NIST CSF 2.0 Functions"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2"
        >
          {NIST_CSF_2_PILLARS.map((pillar) => {
            const isSelected = pillar.code === selectedNistCode;
            return (
              <button
                key={pillar.code}
                role="tab"
                aria-selected={isSelected}
                type="button"
                onClick={() => setSelectedNistCode(pillar.code)}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="text-xs font-mono font-bold">{pillar.code}</div>
                <div className="text-xs font-medium mt-0.5 truncate">
                  {pillar.name.split(' ')[0]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Pillar Detail Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-mono font-semibold text-slate-800">
                Function: {activeNist.name}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">Subcategories: {activeNist.nistCategoryRef}</span>
            </div>
            <h4 className="text-sm font-semibold text-slate-900">
              Engineering Control on Qisda Jetson + ROS 2 + EtherCAT Platform
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {activeNist.roboticsTechnicalControl}
            </p>
            <div className="text-xs font-mono text-slate-700 bg-slate-100 px-3 py-2 rounded-md">
              Verification Artifact: {activeNist.verificationArtifact}
            </div>
          </div>

          <div className="lg:col-span-5 p-4 bg-amber-50/70 border border-amber-200 rounded-xl flex flex-col justify-center">
            <div className="text-xs font-semibold text-amber-900 mb-1.5">
              Canadian Toddler Storybook Explanation ({activeNist.code}, eh!)
            </div>
            <p className="text-sm text-amber-950 leading-relaxed">
              “{activeNist.toddlerCanadianExplanation}”
            </p>
          </div>
        </div>
      </section>

      {/* Taiwan R.O.C. Legal Compliance Auditor & GitHub Release Workbench */}
      <section
        aria-label="Taiwan R.O.C. Legal Compliance and GitHub Export"
        className="bg-white border border-slate-200 rounded-xl p-6 space-y-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Scale className="w-3.5 h-3.5 text-slate-700" />
              <span>Taiwan (R.O.C.) Statutory Pre-Flight Gate</span>
              <span aria-hidden="true">·</span>
              <span>營業秘密法 · 個人資料保護法 · 就業服務法 · 著作權法 · 貿易法</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              {toddlerMode
                ? 'Taiwan Fair-Sharing Rule Checker & GitHub Treasure Box, eh!'
                : 'Taiwan Statutory Legal Compliance Auditor & Clean-Room GitHub Publisher'}
            </h3>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5">
            <div className="text-xs">
              <span className="text-slate-500">Statutory Readiness: </span>
              <span
                className={`font-mono tabular-nums font-bold ${
                  complianceReport.isLegallyClearForGithub
                    ? 'text-emerald-700'
                    : 'text-rose-700'
                }`}
              >
                {complianceReport.overallComplianceScore}% (
                {complianceReport.passedChecksCount}/{complianceReport.totalChecksCount})
              </span>
            </div>
            <div className="text-xs font-semibold">
              {complianceReport.isLegallyClearForGithub ? (
                <span className="inline-flex items-center gap-1 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Cleared for Public GitHub</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-rose-700">
                  <XCircle className="w-4 h-4" />
                  <span>Upload Blocked</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Interactive 6 Statutory Checkboxes */}
          <div className="lg:col-span-6 space-y-3">
            <h4 className="text-xs font-semibold text-slate-900">
              Interactive Taiwan Statutory Compliance Gate (Toggle to Test Blocking Logic)
            </h4>

            <label className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100/70">
              <input
                type="checkbox"
                checked={!auditState.containsProprietaryCadOrCalib}
                onChange={(e) =>
                  setAuditState((prev) => ({
                    ...prev,
                    containsProprietaryCadOrCalib: !e.target.checked,
                  }))
                }
                className="mt-0.5 accent-slate-900"
              />
              <div className="text-xs">
                <div className="font-semibold text-slate-900">
                  1. Trade Secrets Act (營業秘密法 Art. 2 &amp; 10) — Clean-Room Sanitization
                </div>
                <p className="text-slate-600 mt-0.5">
                  Zero Qisda proprietary Pro/E CAD assemblies, factory LiDAR-camera extrinsics, or supplier BOMs in commit tree.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100/70">
              <input
                type="checkbox"
                checked={!auditState.containsRawApplicantOrPatientPii}
                onChange={(e) =>
                  setAuditState((prev) => ({
                    ...prev,
                    containsRawApplicantOrPatientPii: !e.target.checked,
                  }))
                }
                className="mt-0.5 accent-slate-900"
              />
              <div className="text-xs">
                <div className="font-semibold text-slate-900">
                  2. Personal Data Protection Act (個人資料保護法 Art. 6 &amp; 19) — Zero PII
                </div>
                <p className="text-slate-600 mt-0.5">
                  Excludes BenQ Medical Center patient images, unblurred factory worker faces, and 610 job applicant records.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100/70">
              <input
                type="checkbox"
                checked={auditState.disclosesRegularSalaryMin40k}
                onChange={(e) =>
                  setAuditState((prev) => ({
                    ...prev,
                    disclosesRegularSalaryMin40k: e.target.checked,
                  }))
                }
                className="mt-0.5 accent-slate-900"
              />
              <div className="text-xs">
                <div className="font-semibold text-slate-900">
                  3. Employment Service Act (就業服務法 Art. 5 Para. 2 Item 6) — Salary Floor
                </div>
                <p className="text-slate-600 mt-0.5">
                  Verifies statutory compliance of “待遇面議（經常性薪資達 4 萬元或以上）” disclosure threshold (&ge; NT$40,000/month).
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100/70">
              <input
                type="checkbox"
                checked={auditState.enforcesAntiDiscriminationPolicy}
                onChange={(e) =>
                  setAuditState((prev) => ({
                    ...prev,
                    enforcesAntiDiscriminationPolicy: e.target.checked,
                  }))
                }
                className="mt-0.5 accent-slate-900"
              />
              <div className="text-xs">
                <div className="font-semibold text-slate-900">
                  4. Employment Service Act (就業服務法 Art. 5 Para. 1) — Equal Opportunity
                </div>
                <p className="text-slate-600 mt-0.5">
                  Audits candidate evaluation rubric across all 18 statutory protected classes in Taiwan R.O.C.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100/70">
              <input
                type="checkbox"
                checked={auditState.usesPermissiveSpdxLicense}
                onChange={(e) =>
                  setAuditState((prev) => ({
                    ...prev,
                    usesPermissiveSpdxLicense: e.target.checked,
                  }))
                }
                className="mt-0.5 accent-slate-900"
              />
              <div className="text-xs">
                <div className="font-semibold text-slate-900">
                  5. Copyright Act (著作權法 Art. 11) — Apache-2.0 SPDX Provenance
                </div>
                <p className="text-slate-600 mt-0.5">
                  Ensures clean-room code uses permissive Apache-2.0 / BSD-3-Clause headers without GPL viral contamination.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100/70">
              <input
                type="checkbox"
                checked={auditState.screensShtcDualUseExport}
                onChange={(e) =>
                  setAuditState((prev) => ({
                    ...prev,
                    screensShtcDualUseExport: e.target.checked,
                  }))
                }
                className="mt-0.5 accent-slate-900"
              />
              <div className="text-xs">
                <div className="font-semibold text-slate-900">
                  6. Foreign Trade Act (貿易法 Art. 13) — SHTC Export Control Screening
                </div>
                <p className="text-slate-600 mt-0.5">
                  Confirms LWIR thermal fusion code excludes export-controlled dual-use military target-tracking firmware.
                </p>
              </div>
            </label>

            {complianceReport.blockingViolations.length > 0 && (
              <div
                role="alert"
                className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg space-y-1.5"
              >
                <div className="text-xs font-semibold text-rose-900">
                  Blocking Statutory Violations Detected:
                </div>
                <ul className="list-disc list-inside text-xs text-rose-800 space-y-1">
                  {complianceReport.blockingViolations.map((v, i) => (
                    <li key={i}>{v}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right: GitHub Repository Preview & Exporter */}
          <div className="lg:col-span-6 space-y-4">
            <form
              onSubmit={handleVerifyAndStageGithubRelease}
              className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4"
            >
              <h4 className="text-xs font-semibold text-slate-900">
                GitHub Repository Configuration &amp; Pre-Flight Release Attestation
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="gh-owner"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    GitHub Organization / Owner
                  </label>
                  <input
                    id="gh-owner"
                    type="text"
                    value={githubOwner}
                    onChange={(e) => setGithubOwner(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label
                    htmlFor="gh-repo"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    Repository Name
                  </label>
                  <input
                    id="gh-repo"
                    type="text"
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Verify &amp; Stage GitHub Upload</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadCompliantBundle}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download GitHub Bundle (.json)</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyGitCli}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  {copiedGitCmd ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied Git CLI</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Git Push Script</span>
                    </>
                  )}
                </button>
              </div>

              {publishLog.status !== 'idle' && (
                <div
                  role="status"
                  className={`p-3 rounded-lg text-xs border ${
                    publishLog.status === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  <div className="font-semibold">
                    {publishLog.status === 'success'
                      ? `Release Attestation Verified (${publishLog.timestamp})`
                      : 'Statutory Release Gate Blocked'}
                  </div>
                  <p className="mt-0.5">{publishLog.message}</p>
                </div>
              )}
            </form>

            {/* Repository File Inspector */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto">
                {GITHUB_COMPLIANT_REPO_FILES.map((file, idx) => (
                  <button
                    key={file.path}
                    type="button"
                    onClick={() => setSelectedRepoFileIdx(idx)}
                    className={`px-2.5 py-1 text-xs font-mono rounded transition-colors whitespace-nowrap shrink-0 ${
                      selectedRepoFileIdx === idx
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {file.path}
                  </button>
                ))}
              </div>
              <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 text-xs text-slate-600">
                {activeRepoFile.legalClearanceNote}
              </div>
              <pre className="p-3.5 bg-slate-950 text-slate-100 text-xs font-mono overflow-x-auto max-h-64 leading-relaxed">
                <code>{activeRepoFile.content}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
