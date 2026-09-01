import React, { useState } from 'react';
import { UploadCloud, FileSpreadsheet, Download, Check, AlertCircle, X, Sparkles, Database } from 'lucide-react';

const SAMPLE_CSV_TEMPLATE = `InvoiceNumber,VendorName,Category,GSTIN,BaseAmount,TaxAmount,TotalAmount,InvoiceDate,PONumber
INV-2026-9001,Amazon Web Services India Pvt Ltd,Cloud Infrastructure,29AABCA1234F1Z8,125000,22500,147500,2026-08-01,PO-2026-9001
INV-2026-9002,Google Cloud India Pvt Ltd,Cloud Infrastructure,07AABCG5678H1Z2,85000,15300,100300,2026-08-03,PO-2026-9002
INV-2026-9003,Razorpay Software Pvt Ltd,Payment Gateway & FinOps,29AABCR9988D1ZQ,45000,8100,53100,2026-08-05,PO-2026-9003
INV-2026-9004,Zoho Corporation Pvt Ltd,SaaS & Productivity,33AABCZ3344E1Z5,30000,5400,35400,2026-08-07,PO-2026-9004
INV-2026-9005,WeWork India Management Pvt Ltd,Office & Facilities,29AABCW7766M1ZX,250000,45000,295000,2026-08-10,PO-2026-9005
INV-2026-9006,Slack Technologies India,SaaS & Productivity,27AABCS1122K1Z9,65000,11700,76700,2026-08-12,PO-2026-9006
INV-2026-9007,Swiggy Corporate Cafeteria Pvt Ltd,Employee Perks & Food,29AABCS8899N1ZW,42000,0,42000,2026-08-15,PO-2026-9007
INV-2026-9008,Dell Technologies India Pvt Ltd,Hardware & IT Equipment,29AABCD4455L1Z1,180000,32400,212400,2026-08-18,PO-2026-9008
INV-2026-9009,Airtel Enterprise Telecom Ltd,Telecommunications,07AABCA7788P1Z6,28000,5040,33040,2026-08-20,PO-2026-9009
INV-2026-9010,KPMG India Advisory Services LLP,Legal & Compliance,27AABCK9900Q1Z3,150000,27000,177000,2026-08-22,PO-2026-9010`;

export default function UploadCustomDataModal({ isOpen, onClose, onUploadBatch }) {
  const [csvText, setCsvText] = useState('');
  const [fileName, setFileName] = useState('');
  const [parsedCount, setParsedCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      setCsvText(text);
      validateAndCount(text);
    };
    reader.readAsText(file);
  };

  const handleTextChange = (e) => {
    const text = e.target.value;
    setCsvText(text);
    validateAndCount(text);
  };

  const validateAndCount = (text) => {
    setErrorMsg('');
    if (!text.trim()) {
      setParsedCount(0);
      return;
    }
    const lines = text.trim().split('\n').filter(l => l.trim().length > 0);
    if (lines.length <= 1) {
      setParsedCount(0);
      setErrorMsg('CSV must contain a header row and at least 1 record row.');
      return;
    }
    setParsedCount(lines.length - 1);
  };

  const parseCsvToJson = (text) => {
    const lines = text.trim().split('\n').filter(l => l.trim().length > 0);
    if (lines.length <= 1) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase());
    const records = [];

    for (let i = 1; i < lines.length; i++) {
      // Split by comma ignoring commas inside quotes
      const values = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/^["']|["']$/g, ''));
      const obj = {};
      headers.forEach((h, idx) => {
        const val = values[idx] || '';
        if (h.includes('invoice') && !h.includes('date')) obj.invoiceNumber = val;
        else if (h.includes('vendor')) obj.vendorName = val;
        else if (h.includes('category')) obj.category = val;
        else if (h.includes('gstin')) obj.gstin = val;
        else if (h.includes('base')) obj.baseAmount = parseFloat(val) || 0;
        else if (h.includes('tax')) obj.taxAmount = parseFloat(val) || 0;
        else if (h.includes('total') || h.includes('amount')) obj.totalAmount = parseFloat(val) || 0;
        else if (h.includes('date')) obj.invoiceDate = val;
        else if (h.includes('po')) obj.poNumber = val;
        else obj[h] = val;
      });

      if (!obj.invoiceNumber) obj.invoiceNumber = `INV-CUSTOM-${1000 + i}`;
      if (!obj.vendorName) obj.vendorName = `Custom Vendor ${i}`;
      if (!obj.totalAmount) obj.totalAmount = (obj.baseAmount || 10000) + (obj.taxAmount || 1800);

      records.push(obj);
    }
    return records;
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([SAMPLE_CSV_TEMPLATE], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'FinOps_Custom_Batch_Template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadSample = () => {
    setFileName('sample_finops_template.csv');
    setCsvText(SAMPLE_CSV_TEMPLATE);
    validateAndCount(SAMPLE_CSV_TEMPLATE);
  };

  const handleSubmit = async () => {
    if (!csvText.trim()) {
      setErrorMsg('Please upload a CSV file or paste data before submitting.');
      return;
    }

    const records = parseCsvToJson(csvText);
    if (!records.length) {
      setErrorMsg('Could not parse any valid records from the provided CSV.');
      return;
    }

    setIsProcessing(true);
    await onUploadBatch(records);
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="glass-panel w-full max-w-3xl rounded-3xl border border-slate-700/80 p-6 flex flex-col shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                Upload Real / Custom FinOps Dataset
              </h2>
              <p className="text-xs text-slate-400">
                Upload your own CSV or spreadsheet records to run the Autonomous Matching Agent
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 my-4">
          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadTemplate}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                Download CSV Template
              </button>

              <button
                onClick={handleLoadSample}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Load Sample Data
              </button>
            </div>

            {parsedCount > 0 && (
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> {parsedCount} Records Ready
              </span>
            )}
          </div>

          {/* Drag and drop upload zone */}
          <div className="relative border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-2xl p-6 text-center transition-colors bg-slate-950/40">
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center pointer-events-none">
              <FileSpreadsheet className="w-10 h-10 text-slate-500 mb-2" />
              <p className="text-sm font-semibold text-white">
                {fileName ? `Selected: ${fileName}` : 'Drop your CSV file here, or click to browse'}
              </p>
              <p className="text-xs text-slate-400 mt-1">Supports Invoices, Bank Payouts, and PO columns</p>
            </div>
          </div>

          {/* Direct CSV text paste area */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Or Paste CSV Content Directly:
            </label>
            <textarea
              rows="6"
              value={csvText}
              onChange={handleTextChange}
              placeholder="InvoiceNumber,VendorName,Category,GSTIN,BaseAmount,TaxAmount,TotalAmount,InvoiceDate,PONumber&#10;INV-2026-001,AWS India,Cloud,29AABCA1234F1Z8,50000,9000,59000,2026-08-01,PO-101"
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 font-mono text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isProcessing || parsedCount === 0}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 flex items-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
          >
            <Database className="w-4 h-4" />
            {isProcessing ? 'Processing Batch...' : `Reconcile ${parsedCount} Records`}
          </button>
        </div>
      </div>
    </div>
  );
}
