import React, { useState } from 'react';
import { FileSpreadsheet, Layers, Building2, CreditCard, ShoppingBag, X } from 'lucide-react';

export default function BatchInspectorModal({ isOpen, onClose, batchData }) {
  const [activeTab, setActiveTab] = useState('invoices'); // 'invoices' | 'settlements' | 'pos'

  if (!isOpen || !batchData) return null;

  const { metadata, invoices = [], bankSettlements = [], purchaseOrders = [] } = batchData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="glass-panel w-full max-w-5xl h-[85vh] rounded-3xl border border-slate-700/80 p-6 flex flex-col shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                Synthetic Batch Dataset Inspector
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {metadata?.batchId || 'BATCH-ACTIVE'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                50+ Enterprise records across 3 operational layers for autonomous reconciliation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 my-4">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'invoices'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Vendor Invoices / AP Bills ({invoices.length})
          </button>

          <button
            onClick={() => setActiveTab('settlements')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'settlements'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Bank & Razorpay Payout Feeds ({bankSettlements.length})
          </button>

          <button
            onClick={() => setActiveTab('pos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'pos'
                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Purchase Orders ({purchaseOrders.length})
          </button>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto rounded-2xl border border-slate-800 bg-slate-950/60 p-2">
          {activeTab === 'invoices' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800">
                  <th className="py-2.5 px-3">Invoice #</th>
                  <th className="py-2.5 px-3">Vendor</th>
                  <th className="py-2.5 px-3">GSTIN</th>
                  <th className="py-2.5 px-3">PO Linked</th>
                  <th className="py-2.5 px-3 text-right">Base (₹)</th>
                  <th className="py-2.5 px-3 text-right">GST (₹)</th>
                  <th className="py-2.5 px-3 text-right">Total Due (₹)</th>
                  <th className="py-2.5 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {invoices.map((inv, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="py-2 px-3 font-mono font-bold text-emerald-400">{inv.invoiceNumber}</td>
                    <td className="py-2 px-3 text-white font-medium">{inv.vendorName}</td>
                    <td className="py-2 px-3 font-mono text-slate-400">{inv.gstin}</td>
                    <td className="py-2 px-3 font-mono text-slate-300">{inv.poNumber}</td>
                    <td className="py-2 px-3 text-right font-mono">₹{inv.baseAmount.toLocaleString('en-IN')}</td>
                    <td className="py-2 px-3 text-right font-mono">₹{inv.taxAmount.toLocaleString('en-IN')}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-white">
                      ₹{inv.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2 px-3 text-slate-400">{inv.invoiceDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'settlements' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800">
                  <th className="py-2.5 px-3">Settlement ID</th>
                  <th className="py-2.5 px-3">UTR Reference</th>
                  <th className="py-2.5 px-3">Bank Counterparty</th>
                  <th className="py-2.5 px-3">Description / Tag</th>
                  <th className="py-2.5 px-3 text-right">Amount Debited (₹)</th>
                  <th className="py-2.5 px-3">Source Node</th>
                  <th className="py-2.5 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {bankSettlements.map((settl, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="py-2 px-3 font-mono font-bold text-cyan-400">{settl.settlementId}</td>
                    <td className="py-2 px-3 font-mono text-slate-300">{settl.utrNumber}</td>
                    <td className="py-2 px-3 text-white font-medium">{settl.counterparty}</td>
                    <td className="py-2 px-3 text-slate-400 font-mono truncate max-w-xs">{settl.bankDescription}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-white">
                      ₹{settl.amountPaid.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2 px-3 text-xs text-slate-400 font-semibold">{settl.source}</td>
                    <td className="py-2 px-3 text-slate-400">{settl.settlementDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'pos' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800">
                  <th className="py-2.5 px-3">PO Number</th>
                  <th className="py-2.5 px-3">Vendor</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Approved Cap (₹)</th>
                  <th className="py-2.5 px-3">GSTIN</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Issue Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {purchaseOrders.map((po, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="py-2 px-3 font-mono font-bold text-violet-400">{po.poNumber}</td>
                    <td className="py-2 px-3 text-white font-medium">{po.vendorName}</td>
                    <td className="py-2 px-3 text-slate-400">{po.category}</td>
                    <td className="py-2 px-3 font-mono font-bold text-white">
                      ₹{po.approvedAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2 px-3 font-mono text-slate-400">{po.gstin}</td>
                    <td className="py-2 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {po.status}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-400">{po.issueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
