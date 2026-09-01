import React, { useState } from 'react';
import { Download, FileText, CheckCircle2, AlertTriangle, ShieldCheck, X, Copy, Check } from 'lucide-react';

export default function AuditReportModal({ isOpen, onClose, loopData }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !loopData) return null;

  const summary = loopData.loopSummary || {};
  const reconciled = loopData.reconciled || [];
  const exceptions = loopData.exceptions || [];

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(loopData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCSV = () => {
    let csv = 'Type,InvoiceNumber,VendorName,PONumber,UTRNumber,InvoiceAmount,SettlementAmount,Status,Reasoning\n';
    reconciled.forEach(r => {
      csv += `RECONCILED,"${r.invoiceNumber}","${r.vendorName}","${r.poNumber}","${r.utrNumber}",${r.invoiceAmount},${r.settlementAmount},"${r.status}","${r.matchReasoning.replace(/"/g, '""')}"\n`;
    });
    exceptions.forEach(e => {
      csv += `EXCEPTION,"${e.invoiceNumber}","${e.vendorName}","${e.evidence?.po?.poNumber || 'N/A'}","${e.evidence?.settlement?.utrNumber || 'N/A'}",${e.invoiceAmount},${e.settlementAmount},"${e.rootCause}","${e.aiDiagnosis.replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FinOps_Reconciliation_Audit_${summary.batchId || 'Report'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="glass-panel w-full max-w-4xl max-h-[90vh] rounded-3xl border border-slate-700/80 p-6 flex flex-col shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/30">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">
                FinOps Reconciliation Audit Statement
              </h2>
              <p className="text-xs text-slate-400">
                Compliance-ready executive summary & multi-pass reconciliation audit trail
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate / Summary Banner */}
        <div className="my-4 p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-emerald-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Autonomous Execution Attestation
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Generated: {new Date(summary.timestamp || Date.now()).toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2 border-t border-slate-800">
            <div>
              <span className="text-slate-400">Match Rate:</span>
              <div className="text-base font-extrabold text-emerald-400">{summary.matchRate}</div>
            </div>
            <div>
              <span className="text-slate-400">Auto-Closed:</span>
              <div className="text-base font-extrabold text-white">
                {summary.autoClosedRecords} / {summary.totalRecords}
              </div>
            </div>
            <div>
              <span className="text-slate-400">Auto-Closed (₹):</span>
              <div className="text-base font-extrabold text-cyan-300">
                ₹{(summary.autoClosedVolume || 0).toLocaleString('en-IN')}
              </div>
            </div>
            <div>
              <span className="text-slate-400">Value at Risk (₹):</span>
              <div className="text-base font-extrabold text-rose-400">
                ₹{(summary.valueAtRisk || 0).toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>

        {/* Audit Highlights */}
        <div className="flex-1 overflow-auto space-y-3 my-2 pr-1">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Agent Audit Trail Breakdown
          </h3>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">Pass 1: Deterministic Exact Match (100% Parity)</span>
              <span className="font-mono font-bold text-emerald-400">
                {loopData.auditTrail?.pass1DeterministicCount || 0} Records
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">Pass 2: Section 194C/194J Statutory TDS Payout Matching</span>
              <span className="font-mono font-bold text-cyan-400">
                {loopData.auditTrail?.pass2TdsAdjustedCount || 0} Records
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">Pass 3: Heuristic & Fuzzy Vendor Alias Resolution</span>
              <span className="font-mono font-bold text-violet-400">
                {loopData.auditTrail?.pass3FuzzyAliasCount || 0} Records
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-rose-900/40 bg-rose-950/10 flex items-center justify-between">
              <span className="text-rose-300">Pass 4: Isolated Non-Compliant Exceptions</span>
              <span className="font-mono font-bold text-rose-400">{exceptions.length} Records</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-800">
          <button
            onClick={handleCopyJSON}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied JSON!' : 'Copy Audit JSON'}
          </button>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleDownloadCSV}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download CSV Audit Statement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
