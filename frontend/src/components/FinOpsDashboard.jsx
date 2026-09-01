import React, { useState, useEffect } from 'react';
import {
  Play,
  RotateCw,
  FileSpreadsheet,
  Download,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ShieldAlert,
  Zap,
  Layers,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Info,
  Building2,
  Clock
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

export default function FinOpsDashboard({
  loopData,
  onRunLoop,
  onRegenerate,
  onResolveException,
  onOpenBatchModal,
  onOpenReportModal,
  onOpenUploadModal,
  isLoading,
  batchCount
}) {
  const [activeTab, setActiveTab] = useState('matrix'); // 'matrix' | 'exceptions' | 'audit'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'EXACT' | 'TDS' | 'FUZZY' | 'EXCEPTION'
  const [selectedException, setSelectedException] = useState(null);
  const [hitlNotes, setHitlNotes] = useState('');
  const [isResolving, setIsResolving] = useState(false);

  const summary = loopData?.loopSummary || {
    batchId: 'BATCH-INIT',
    totalRecords: 60,
    autoClosedRecords: 50,
    unresolvedExceptions: 10,
    matchRate: '83.3%',
    matchRatePercent: 83.3,
    exceptionRatePercent: 16.7,
    totalBatchVolume: 16414550,
    autoClosedVolume: 13640730,
    valueAtRisk: 1992496,
    aiConfidenceIndex: '95.2%',
    executionTimeMs: 120
  };

  const reconciled = loopData?.reconciled || [];
  const exceptions = loopData?.exceptions || [];

  // Recharts data
  const pieData = [
    { name: '3-Way Exact Match', value: reconciled.filter(r => r.matchType.includes('EXACT')).length, color: '#10B981' },
    { name: 'TDS Adjusted (194C/J)', value: reconciled.filter(r => r.matchType.includes('TDS')).length, color: '#06B6D4' },
    { name: 'Fuzzy Vendor Alias', value: reconciled.filter(r => r.matchType.includes('FUZZY')).length, color: '#8B5CF6' },
    { name: 'Unresolved Exceptions', value: exceptions.length, color: '#EF4444' }
  ];

  const rootCauseDistribution = [
    { cause: 'Amount Mismatch', count: exceptions.filter(e => e.rootCause === 'AMOUNT_MISMATCH').length },
    { cause: 'Tax Discrepancy', count: exceptions.filter(e => e.rootCause === 'GST_TAX_DISCREPANCY').length },
    { cause: 'Missing PO (Shadow)', count: exceptions.filter(e => e.rootCause === 'MISSING_PO_REF').length },
    { cause: 'Duplicate Payment', count: exceptions.filter(e => e.rootCause === 'DUPLICATE_PAYMENT_RISK').length },
    { cause: 'Unknown Vendor', count: exceptions.filter(e => e.rootCause === 'UNKNOWN_COUNTERPARTY').length }
  ];

  // Filtering for matrix table
  const allRows = [
    ...reconciled.map(r => ({ ...r, rowType: 'RECONCILED' })),
    ...exceptions.map(e => ({
      reconciliationId: e.exceptionId,
      invoiceNumber: e.invoiceNumber,
      poNumber: e.evidence?.po?.poNumber || 'N/A',
      utrNumber: e.evidence?.settlement?.utrNumber || e.evidence?.duplicateSettlement?.utrNumber || 'PENDING',
      vendorName: e.vendorName,
      bankCounterparty: e.evidence?.settlement?.counterparty || 'N/A',
      category: e.category,
      invoiceAmount: e.invoiceAmount,
      settlementAmount: e.settlementAmount,
      matchType: `EXCEPTION: ${e.rootCause}`,
      matchConfidence: 0.0,
      matchReasoning: e.aiDiagnosis,
      status: 'EXCEPTION_FLAGGED',
      rowType: 'EXCEPTION',
      exceptionRef: e
    }))
  ];

  const filteredRows = allRows.filter(row => {
    const matchesSearch =
      row.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (row.poNumber && row.poNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (row.utrNumber && row.utrNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterType === 'ALL') return true;
    if (filterType === 'EXACT') return row.matchType?.includes('EXACT');
    if (filterType === 'TDS') return row.matchType?.includes('TDS');
    if (filterType === 'FUZZY') return row.matchType?.includes('FUZZY');
    if (filterType === 'EXCEPTION') return row.rowType === 'EXCEPTION';
    return true;
  });

  const handleResolve = async (exceptionId, actionType) => {
    setIsResolving(true);
    await onResolveException(exceptionId, actionType, hitlNotes || `Approved via FinOps Controller triage dashboard.`);
    setSelectedException(null);
    setHitlNotes('');
    setIsResolving(false);
  };

  return (
    <div className="space-y-6">
      {/* Hero Header & Control Bar */}
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden border border-slate-700/60 shadow-2xl">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Razorpay AI FinOps Agent
              </span>
              <span className="px-2.5 py-1 text-xs font-mono rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Batch: {summary.batchId}
              </span>
              <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {summary.executionTimeMs}ms
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Autonomous 3-Way Reconciliation Controller
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              AI agent closes the enterprise finance-ops loop across a 50+ record batch (Invoices ↔ Bank/Razorpay UTRs ↔ POs), reporting match rates, TDS variances, and unresolvable exceptions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onRunLoop}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
            >
              <Play className={`w-4 h-4 fill-current ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Executing Loop...' : 'Run FinOps Loop'}
            </button>

            <button
              onClick={onOpenUploadModal}
              className="px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
              Upload Custom CSV
            </button>

            <button
              onClick={() => onRegenerate(60)}
              disabled={isLoading}
              className="px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCw className="w-4 h-4 text-emerald-400" />
              Regenerate (60)
            </button>

            <button
              onClick={onOpenBatchModal}
              className="px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              Inspect Batch
            </button>

            <button
              onClick={onOpenReportModal}
              className="px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-violet-400" />
              Audit Report
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Match Rate Card */}
        <div className="glass-card p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Match Rate</span>
            <span className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-emerald-300">{summary.matchRate}</div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <span className="font-semibold text-emerald-400">{summary.autoClosedRecords}</span> of {summary.totalRecords} records auto-closed
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-800/80 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-1000"
              style={{ width: `${summary.matchRatePercent}%` }}
            />
          </div>
        </div>

        {/* Auto-Closed Volume */}
        <div className="glass-card p-5 rounded-2xl border border-cyan-500/30 bg-cyan-950/20">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Auto-Closed Volume</span>
            <span className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
              <TrendingUp className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-cyan-200">
              ₹{(summary.autoClosedVolume || 0).toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              of ₹{(summary.totalBatchVolume || 0).toLocaleString('en-IN')} total batch
            </div>
          </div>
        </div>

        {/* Unresolved Exceptions */}
        <div className="glass-card p-5 rounded-2xl border border-rose-500/30 bg-rose-950/20">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">Exceptions Flagged</span>
            <span className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-rose-300">{summary.unresolvedExceptions}</div>
            <div className="text-xs text-slate-400 mt-1">
              {summary.exceptionRatePercent}% requiring human triage
            </div>
          </div>
        </div>

        {/* Value at Risk */}
        <div className="glass-card p-5 rounded-2xl border border-amber-500/30 bg-amber-950/20">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Value at Risk</span>
            <span className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-amber-200">
              ₹{(summary.valueAtRisk || 0).toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-slate-400 mt-1">Disputes, missing POs & taxes</div>
          </div>
        </div>

        {/* AI Confidence Index */}
        <div className="glass-card p-5 rounded-2xl border border-violet-500/30 bg-violet-950/20">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">AI Confidence Index</span>
            <span className="p-2 rounded-lg bg-violet-500/20 text-violet-400">
              <Zap className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-violet-300">{summary.aiConfidenceIndex}</div>
            <div className="text-xs text-slate-400 mt-1">Multi-pass validation score</div>
          </div>
        </div>
      </div>

      {/* Analytics Visuals Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Match Breakdown Donut */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-700/60 lg:col-span-1">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" /> Reconciliation Distribution
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#111827', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300 truncate">{item.name}:</span>
                <span className="font-bold text-white ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Exception Anomaly Breakdown Bar Chart */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-700/60 lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" /> Unresolved Exception Root Causes
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rootCauseDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="cause" stroke="#94A3B8" fontSize={11} angle={-15} textAnchor="end" />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{ background: '#111827', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="count" fill="#F43F5E" radius={[6, 6, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            AI automatically isolates policy non-compliance, duplicate payouts, and tax rate variances to prevent revenue leakage.
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Reconciliation Ledger ({filteredRows.length})
          </button>
          <button
            onClick={() => setActiveTab('exceptions')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'exceptions'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Exception Triage Console
            <span className="px-2 py-0.5 text-xs rounded-full bg-rose-500/30 text-rose-300 font-mono">
              {exceptions.length}
            </span>
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search vendor, INV, UTR..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="ALL">All Types</option>
            <option value="EXACT">3-Way Exact</option>
            <option value="TDS">TDS Adjusted</option>
            <option value="FUZZY">Fuzzy Alias</option>
            <option value="EXCEPTION">Exceptions Only</option>
          </select>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'matrix' && (
        <div className="glass-panel rounded-2xl border border-slate-700/60 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/90 border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-4">Invoice / Reference</th>
                  <th className="py-3.5 px-4">Vendor & Category</th>
                  <th className="py-3.5 px-4">PO / UTR Settlement</th>
                  <th className="py-3.5 px-4 text-right">Invoice Amt</th>
                  <th className="py-3.5 px-4 text-right">Settlement Amt</th>
                  <th className="py-3.5 px-4">Match Method & Confidence</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredRows.map((row, idx) => {
                  const isExc = row.rowType === 'EXCEPTION';
                  return (
                    <tr
                      key={idx}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isExc ? 'bg-rose-950/10' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-medium text-white">
                        {row.invoiceNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-200">{row.vendorName}</div>
                        <div className="text-[11px] text-slate-400">{row.category}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300">
                        <div>PO: {row.poNumber}</div>
                        <div className="text-[11px] text-slate-400">UTR: {row.utrNumber}</div>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-200">
                        ₹{(row.invoiceAmount || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-200">
                        ₹{(row.settlementAmount || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              row.matchType?.includes('EXACT')
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : row.matchType?.includes('TDS')
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                : row.matchType?.includes('FUZZY')
                                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {row.matchType?.replace('SECTION 194C/194J ', '')}
                          </span>
                          {row.matchConfidence > 0 && (
                            <span className="text-[11px] text-slate-400 font-mono">
                              {(row.matchConfidence * 100).toFixed(0)}%
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 max-w-xs truncate" title={row.matchReasoning}>
                          {row.matchReasoning}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            isExc
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          }`}
                        >
                          {isExc ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isExc ? (
                          <button
                            onClick={() => setSelectedException(row.exceptionRef)}
                            className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-[11px] shadow-sm transition-all cursor-pointer"
                          >
                            Triage & Fix
                          </button>
                        ) : (
                          <span className="text-slate-500 text-[11px] font-mono">Closed</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Exception Triage Console Tab */}
      {activeTab === 'exceptions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              Unresolved Exception Queue ({exceptions.length} Items)
            </h2>
            <span className="text-xs text-slate-400">
              Autonomous AI diagnostics with Human-in-the-Loop policy resolution
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exceptions.map((exc, idx) => (
              <div
                key={idx}
                className="glass-card p-5 rounded-2xl border border-rose-500/30 bg-rose-950/15 relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">
                        {exc.rootCause.replace(/_/g, ' ')}
                      </span>
                      <h3 className="text-base font-bold text-white mt-1.5">{exc.vendorName}</h3>
                      <p className="text-xs font-mono text-slate-400">Invoice: {exc.invoiceNumber}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-rose-400 font-semibold block uppercase">Variance</span>
                      <span className="text-lg font-extrabold text-rose-300">
                        ₹{(exc.varianceAmount || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* AI Diagnostic Reasoning Box */}
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-slate-300 space-y-2 mb-4">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px] uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" /> AI Diagnostic Analysis
                    </div>
                    <p className="text-slate-300 leading-relaxed">{exc.aiDiagnosis}</p>
                    <div className="pt-2 border-t border-slate-800 text-slate-400 flex items-start gap-1">
                      <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-cyan-300 font-medium">Recommended Action:</strong> {exc.suggestedAction}
                      </span>
                    </div>
                  </div>
                </div>

                {/* HITL Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => handleResolve(exc.exceptionId, 'APPROVE_VARIANCE_WAIVER')}
                    disabled={isResolving}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow"
                  >
                    Approve Variance Waiver
                  </button>
                  <button
                    onClick={() => handleResolve(exc.exceptionId, 'ISSUE_VENDOR_DISPUTE')}
                    disabled={isResolving}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow"
                  >
                    Issue Debit/Credit Note
                  </button>
                  <button
                    onClick={() => handleResolve(exc.exceptionId, 'POST_FACTO_PO_APPROVAL')}
                    disabled={isResolving}
                    className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow"
                  >
                    Post-Facto PO Sign-Off
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exception Drill-Down Modal */}
      {selectedException && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-2xl rounded-2xl border border-rose-500/40 p-6 shadow-2xl relative">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  {selectedException.rootCause}
                </span>
                <h2 className="text-xl font-extrabold text-white mt-2">
                  {selectedException.vendorName}
                </h2>
                <p className="text-xs text-slate-400 font-mono">Invoice: {selectedException.invoiceNumber}</p>
              </div>
              <button
                onClick={() => setSelectedException(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 my-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 text-xs space-y-2">
                <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> AI Root-Cause Diagnostic
                </span>
                <p className="text-slate-200 text-sm leading-relaxed">{selectedException.aiDiagnosis}</p>
                <p className="text-cyan-300 text-xs font-semibold">
                  Suggested Action: {selectedException.suggestedAction}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Controller Audit Resolution Notes
                </label>
                <textarea
                  rows="3"
                  value={hitlNotes}
                  onChange={e => setHitlNotes(e.target.value)}
                  placeholder="Enter audit rationale for exception resolution / variance override..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setSelectedException(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleResolve(selectedException.exceptionId, 'CONTROLLER_POLICY_OVERRIDE')}
                disabled={isResolving}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20"
              >
                {isResolving ? 'Resolving...' : 'Confirm Exception Resolution'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
