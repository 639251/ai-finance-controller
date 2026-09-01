/**
 * Synthetic Enterprise FinOps Data Generator
 * Generates 50+ realistic corporate records across 3 operational layers:
 * 1. Vendor Invoices (AP Bills)
 * 2. Bank & Payment Gateway Settlement Feeds (Razorpay Payouts / Bank UTRs)
 * 3. Purchase Orders & Contracts (Approved procurement ledger)
 *
 * Includes realistic edge cases:
 * - Clean 1:1 and 3-Way matches
 * - Net-of-TDS adjustments (Section 194C @ 2%, Section 194J @ 10%)
 * - Vendor descriptor / alias variations (e.g., 'AMZN AWS INDIA' vs 'Amazon Web Services India Pvt Ltd')
 * - Real-world anomalies (Amount discrepancies, Tax mismatch, Missing POs, Duplicate charges, SLA delays)
 */

export const VENDOR_CATALOG = [
  { name: 'Amazon Web Services India Pvt Ltd', aliases: ['AWS INDIA', 'AMZN AWS CLOUD', 'AMAZON WEB SERVICES'], category: 'Cloud Infrastructure', gstin: '29AABCA1234F1Z8', tdsRate: 0.02 },
  { name: 'Google Cloud India Pvt Ltd', aliases: ['GCP SERVICES', 'GOOGLE CLOUD IND', 'GOOGLE ASIA PACIFIC'], category: 'Cloud Infrastructure', gstin: '07AABCG5678H1Z2', tdsRate: 0.02 },
  { name: 'Razorpay Software Pvt Ltd', aliases: ['RAZORPAY GATEWAY', 'RAZORPAY FEES', 'RZP SOFTWARE'], category: 'Payment Gateway & FinOps', gstin: '29AABCR9988D1ZQ', tdsRate: 0.00 },
  { name: 'Zoho Corporation Pvt Ltd', aliases: ['ZOHO CRM CORP', 'ZOHO SUBSCRIPTION', 'ZOHO CORP'], category: 'SaaS & Productivity', gstin: '33AABCZ3344E1Z5', tdsRate: 0.10 },
  { name: 'Slack Technologies India', aliases: ['SLACK ENTERPRISE', 'SALESFORCE SLACK', 'SLACK COMM'], category: 'SaaS & Productivity', gstin: '27AABCS1122K1Z9', tdsRate: 0.10 },
  { name: 'WeWork India Management Pvt Ltd', aliases: ['WEWORK WORKSPACES', 'WEWORK BANGLORE', 'WEWORK IND'], category: 'Office & Facilities', gstin: '29AABCW7766M1ZX', tdsRate: 0.10 },
  { name: 'Swiggy Corporate Cafeteria Pvt Ltd', aliases: ['SWIGGY FOR WORK', 'BUNDL TECH SWIGGY', 'SWIGGY CORP'], category: 'Employee Perks & Food', gstin: '29AABCS8899N1ZW', tdsRate: 0.00 },
  { name: 'Dell Technologies India Pvt Ltd', aliases: ['DELL COMPUTERS', 'DELL GLOBAL IND', 'DELL HARDWARE'], category: 'Hardware & IT Equipment', gstin: '29AABCD4455L1Z1', tdsRate: 0.02 },
  { name: 'Airtel Enterprise Telecom Ltd', aliases: ['BHARTI AIRTEL LEASED', 'AIRTEL CORP FIBRE', 'AIRTEL B2B'], category: 'Telecommunications', gstin: '07AABCA7788P1Z6', tdsRate: 0.02 },
  { name: 'KPMG India Advisory Services LLP', aliases: ['KPMG AUDIT & TAX', 'KPMG ADVISORY IND', 'KPMG LLP'], category: 'Legal & Compliance', gstin: '27AABCK9900Q1Z3', tdsRate: 0.10 },
  { name: 'Uber for Business India', aliases: ['UBER BV B2B', 'UBER CORPORATE RIDES', 'UBER INDIA'], category: 'Travel & Mobility', gstin: '27AABCU4433R1Z7', tdsRate: 0.02 },
  { name: 'Blue Dart Express Ltd', aliases: ['BLUE DART COURIER', 'BLUE DART LOGISTICS', 'BLUEDART B2B'], category: 'Logistics & Supply', gstin: '27AABCB6655S1Z4', tdsRate: 0.02 },
  { name: 'Freshworks Technologies India', aliases: ['FRESHWORKS INC', 'FRESHDESK B2B', 'FRESHWORKS SAAS'], category: 'SaaS & Productivity', gstin: '33AABCF8877T1Z2', tdsRate: 0.10 },
  { name: 'CleverTap Analytics Pvt Ltd', aliases: ['WIZROCKET CLEVERTAP', 'CLEVERTAP ENGAGE', 'CLEVERTAP'], category: 'Marketing & Retention', gstin: '27AABCW1122U1Z9', tdsRate: 0.10 },
  { name: 'Dun & Bradstreet India Pvt Ltd', aliases: ['D&B COMPLIANCE', 'DUN AND BRADSTREET', 'DNB INDIA'], category: 'Risk & Verification', gstin: '27AABCD3322V1Z5', tdsRate: 0.10 }
];

export function generateSyntheticFinOpsBatch(recordCount = 60) {
  const invoices = [];
  const bankSettlements = [];
  const purchaseOrders = [];

  const baseDate = new Date('2026-08-01T10:00:00Z');

  // Distribution config for 60 records:
  // ~48 Clean / Solvable (Exact, TDS-Adjusted, Fuzzy Alias, Batch settlement) -> ~80%
  // ~12 Structured Exceptions (Amount mismatch, Tax discrepancy, Missing PO, Duplicate charge, Unknown counterparty, SLA delayed) -> ~20%

  let globalId = 1000;

  for (let i = 0; i < recordCount; i++) {
    globalId++;
    const vendorIndex = i % VENDOR_CATALOG.length;
    const vendor = VENDOR_CATALOG[vendorIndex];

    const dayOffset = Math.floor(i * 0.45);
    const invDate = new Date(baseDate.getTime() + dayOffset * 86400000);
    const invDateStr = invDate.toISOString().split('T')[0];

    // Base values
    const baseAmount = Math.round(15000 + ((i * 7391) % 485000));
    const gstRate = 0.18;
    const calculatedGst = Math.round(baseAmount * gstRate);
    const invoiceTotal = baseAmount + calculatedGst;

    const invoiceNumber = `INV-2026-${globalId}`;
    const poNumber = `PO-2026-${globalId}`;
    const utrNumber = `UTR${invDateStr.replace(/-/g, '')}RZP${100000 + i}`;

    // Decide scenario type based on index
    const scenarioType = getScenarioType(i, recordCount);

    let poRecord = null;
    let invRecord = null;
    let bankRecord = null;

    if (scenarioType === 'CLEAN_EXACT') {
      // 100% exact 3-way match
      poRecord = {
        poNumber,
        vendorName: vendor.name,
        category: vendor.category,
        approvedAmount: invoiceTotal,
        gstin: vendor.gstin,
        status: 'APPROVED',
        issueDate: invDateStr
      };

      invRecord = {
        invoiceNumber,
        poNumber,
        vendorName: vendor.name,
        category: vendor.category,
        gstin: vendor.gstin,
        baseAmount,
        taxAmount: calculatedGst,
        totalAmount: invoiceTotal,
        invoiceDate: invDateStr,
        dueDate: addDays(invDateStr, 30),
        status: 'PENDING_RECONCILIATION'
      };

      bankRecord = {
        settlementId: `SETTL-${globalId}`,
        utrNumber,
        counterparty: vendor.name,
        bankDescription: `NEFT-PAYMENT-${vendor.name.substring(0, 15)}-${invoiceNumber}`,
        amountPaid: invoiceTotal,
        settlementDate: addDays(invDateStr, 3),
        source: 'RAZORPAY_PAYOUT_NODE',
        status: 'UNRECONCILED'
      };
    } else if (scenarioType === 'CLEAN_TDS_ADJUSTED') {
      // Net-of-TDS payment (Section 194C/194J)
      const tdsRate = vendor.tdsRate > 0 ? vendor.tdsRate : 0.02;
      const tdsDeduction = Math.round(baseAmount * tdsRate);
      const netPayout = invoiceTotal - tdsDeduction;

      poRecord = {
        poNumber,
        vendorName: vendor.name,
        category: vendor.category,
        approvedAmount: invoiceTotal,
        gstin: vendor.gstin,
        status: 'APPROVED',
        issueDate: invDateStr
      };

      invRecord = {
        invoiceNumber,
        poNumber,
        vendorName: vendor.name,
        category: vendor.category,
        gstin: vendor.gstin,
        baseAmount,
        taxAmount: calculatedGst,
        totalAmount: invoiceTotal,
        tdsApplicable: true,
        tdsRate: tdsRate,
        tdsAmount: tdsDeduction,
        netPayable: netPayout,
        invoiceDate: invDateStr,
        dueDate: addDays(invDateStr, 30),
        status: 'PENDING_RECONCILIATION'
      };

      bankRecord = {
        settlementId: `SETTL-${globalId}`,
        utrNumber,
        counterparty: vendor.name,
        bankDescription: `RTGS-TDS_DED-${invoiceNumber}-${vendor.name.substring(0, 12)}`,
        amountPaid: netPayout,
        settlementDate: addDays(invDateStr, 4),
        source: 'AXIS_CORPORATE_FEED',
        status: 'UNRECONCILED'
      };
    } else if (scenarioType === 'CLEAN_FUZZY_ALIAS') {
      // Vendor name in bank feed is an abbreviated alias
      const alias = vendor.aliases[i % vendor.aliases.length];
      poRecord = {
        poNumber,
        vendorName: vendor.name,
        category: vendor.category,
        approvedAmount: invoiceTotal,
        gstin: vendor.gstin,
        status: 'APPROVED',
        issueDate: invDateStr
      };

      invRecord = {
        invoiceNumber,
        poNumber,
        vendorName: vendor.name,
        category: vendor.category,
        gstin: vendor.gstin,
        baseAmount,
        taxAmount: calculatedGst,
        totalAmount: invoiceTotal,
        invoiceDate: invDateStr,
        dueDate: addDays(invDateStr, 30),
        status: 'PENDING_RECONCILIATION'
      };

      bankRecord = {
        settlementId: `SETTL-${globalId}`,
        utrNumber,
        counterparty: alias,
        bankDescription: `PAYOUT-DIRECT-${alias}-${invoiceNumber}`,
        amountPaid: invoiceTotal,
        settlementDate: addDays(invDateStr, 2),
        source: 'RAZORPAY_PAYOUT_NODE',
        status: 'UNRECONCILED'
      };
    } else if (scenarioType === 'EXCEPTION_AMOUNT_MISMATCH') {
      // Bank paid different from invoice (e.g. unrecorded line item dispute ₹8,500 difference)
      const disputeVariance = 8500;
      const bankAmount = invoiceTotal - disputeVariance;

      poRecord = {
        poNumber,
        vendorName: vendor.name,
        category: vendor.category,
        approvedAmount: invoiceTotal,
        gstin: vendor.gstin,
        status: 'APPROVED',
        issueDate: invDateStr
      };

      invRecord = {
        invoiceNumber,
        poNumber,
        vendorName: vendor.name,
        category: vendor.category,
        gstin: vendor.gstin,
        baseAmount,
        taxAmount: calculatedGst,
        totalAmount: invoiceTotal,
        invoiceDate: invDateStr,
        dueDate: addDays(invDateStr, 30),
        status: 'PENDING_RECONCILIATION',
        expectedVariance: disputeVariance
      };

      bankRecord = {
        settlementId: `SETTL-${globalId}`,
        utrNumber,
        counterparty: vendor.name,
        bankDescription: `ACH-DEBIT-DISPUTED_DIFF-${invoiceNumber}`,
        amountPaid: bankAmount,
        settlementDate: addDays(invDateStr, 5),
        source: 'HDFC_CMS_FEED',
        status: 'UNRECONCILED'
      };
    } else if (scenarioType === 'EXCEPTION_GST_TAX_DISCREPANCY') {
      // Vendor billed 28% GST instead of standard 18%, causing total mismatch with PO
      const wrongGst = Math.round(baseAmount * 0.28);
      const wrongTotal = baseAmount + wrongGst;

      poRecord = {
        poNumber,
        vendorName: vendor.name,
        category: vendor.category,
        approvedAmount: invoiceTotal, // PO was for 18% GST
        gstin: vendor.gstin,
        status: 'APPROVED',
        issueDate: invDateStr
      };

      invRecord = {
        invoiceNumber,
        poNumber,
        vendorName: vendor.name,
        category: vendor.category,
        gstin: vendor.gstin,
        baseAmount,
        taxAmount: wrongGst, // Incorrect rate
        totalAmount: wrongTotal,
        invoiceDate: invDateStr,
        dueDate: addDays(invDateStr, 30),
        status: 'PENDING_RECONCILIATION'
      };

      bankRecord = {
        settlementId: `SETTL-${globalId}`,
        utrNumber,
        counterparty: vendor.name,
        bankDescription: `CMS-VENDOR-PAY-${invoiceNumber}`,
        amountPaid: wrongTotal,
        settlementDate: addDays(invDateStr, 2),
        source: 'RAZORPAY_PAYOUT_NODE',
        status: 'UNRECONCILED'
      };
    } else if (scenarioType === 'EXCEPTION_MISSING_PO') {
      // Payout made without any matching approved Purchase Order (Shadow spend)
      invRecord = {
        invoiceNumber,
        poNumber: 'UNSPECIFIED_PO',
        vendorName: vendor.name,
        category: vendor.category,
        gstin: vendor.gstin,
        baseAmount,
        taxAmount: calculatedGst,
        totalAmount: invoiceTotal,
        invoiceDate: invDateStr,
        dueDate: addDays(invDateStr, 15),
        status: 'PENDING_RECONCILIATION'
      };

      bankRecord = {
        settlementId: `SETTL-${globalId}`,
        utrNumber,
        counterparty: vendor.name,
        bankDescription: `AD-HOC-CORP-EXPENSE-${invoiceNumber}`,
        amountPaid: invoiceTotal,
        settlementDate: addDays(invDateStr, 1),
        source: 'ICICI_VIRTUAL_ACC',
        status: 'UNRECONCILED'
      };
      // No PO created
    } else if (scenarioType === 'EXCEPTION_DUPLICATE_PAYMENT') {
      // 2 bank settlements referencing the identical invoice (Double-debit risk)
      poRecord = {
        poNumber,
        vendorName: vendor.name,
        category: vendor.category,
        approvedAmount: invoiceTotal,
        gstin: vendor.gstin,
        status: 'APPROVED',
        issueDate: invDateStr
      };

      invRecord = {
        invoiceNumber,
        poNumber,
        vendorName: vendor.name,
        category: vendor.category,
        gstin: vendor.gstin,
        baseAmount,
        taxAmount: calculatedGst,
        totalAmount: invoiceTotal,
        invoiceDate: invDateStr,
        dueDate: addDays(invDateStr, 30),
        status: 'PENDING_RECONCILIATION'
      };

      bankRecord = {
        settlementId: `SETTL-${globalId}`,
        utrNumber,
        counterparty: vendor.name,
        bankDescription: `NEFT-PAY-${invoiceNumber}`,
        amountPaid: invoiceTotal,
        settlementDate: addDays(invDateStr, 2),
        source: 'RAZORPAY_PAYOUT_NODE',
        status: 'UNRECONCILED'
      };

      // Create ghost secondary settlement
      const duplicateBankRecord = {
        settlementId: `SETTL-DUP-${globalId}`,
        utrNumber: `UTR${invDateStr.replace(/-/g, '')}DUP${888000 + i}`,
        counterparty: vendor.name,
        bankDescription: `NEFT-RE-ATTEMPT-${invoiceNumber}`,
        amountPaid: invoiceTotal,
        settlementDate: addDays(invDateStr, 6),
        source: 'HDFC_AUTO_DEBIT',
        status: 'UNRECONCILED',
        isDuplicateFlag: true
      };
      bankSettlements.push(duplicateBankRecord);
    } else if (scenarioType === 'EXCEPTION_UNKNOWN_COUNTERPARTY') {
      // Bank feed contains unrecognizable vendor string not in master catalog
      invRecord = {
        invoiceNumber,
        poNumber,
        vendorName: 'Global Cloud Systems Direct Inc',
        category: 'Unclassified Foreign Vendor',
        gstin: 'UNREGISTERED_NON_GST',
        baseAmount,
        taxAmount: 0,
        totalAmount: baseAmount,
        invoiceDate: invDateStr,
        dueDate: addDays(invDateStr, 15),
        status: 'PENDING_RECONCILIATION'
      };

      bankRecord = {
        settlementId: `SETTL-${globalId}`,
        utrNumber,
        counterparty: 'WIRE-OUTWARD-TXN99281-UNKNOWN',
        bankDescription: `FOREX-WIRE-DEBIT-REF-${invoiceNumber}`,
        amountPaid: baseAmount,
        settlementDate: addDays(invDateStr, 1),
        source: 'CITI_SWIFT_FEED',
        status: 'UNRECONCILED'
      };
    } else {
      // Default clean match
      poRecord = {
        poNumber,
        vendorName: vendor.name,
        category: vendor.category,
        approvedAmount: invoiceTotal,
        gstin: vendor.gstin,
        status: 'APPROVED',
        issueDate: invDateStr
      };

      invRecord = {
        invoiceNumber,
        poNumber,
        vendorName: vendor.name,
        category: vendor.category,
        gstin: vendor.gstin,
        baseAmount,
        taxAmount: calculatedGst,
        totalAmount: invoiceTotal,
        invoiceDate: invDateStr,
        dueDate: addDays(invDateStr, 30),
        status: 'PENDING_RECONCILIATION'
      };

      bankRecord = {
        settlementId: `SETTL-${globalId}`,
        utrNumber,
        counterparty: vendor.name,
        bankDescription: `RZP-PAYMENT-${invoiceNumber}`,
        amountPaid: invoiceTotal,
        settlementDate: addDays(invDateStr, 2),
        source: 'RAZORPAY_PAYOUT_NODE',
        status: 'UNRECONCILED'
      };
    }

    if (poRecord) purchaseOrders.push(poRecord);
    if (invRecord) invoices.push(invRecord);
    if (bankRecord) bankSettlements.push(bankRecord);
  }

  return {
    batchMetadata: {
      batchId: `BATCH-FINOPS-${Date.now()}`,
      createdAt: new Date().toISOString(),
      totalInvoices: invoices.length,
      totalBankSettlements: bankSettlements.length,
      totalPurchaseOrders: purchaseOrders.length,
      targetOpsLoop: '3-Way AP Invoice vs Bank/Razorpay Settlement vs PO'
    },
    invoices,
    bankSettlements,
    purchaseOrders
  };
}

function getScenarioType(index, total) {
  // Deterministic distribution for consistent 50+ batch demo
  // Indices mapped to specific realistic scenarios
  if (index === 5 || index === 21) return 'EXCEPTION_AMOUNT_MISMATCH';
  if (index === 11 || index === 33) return 'EXCEPTION_GST_TAX_DISCREPANCY';
  if (index === 17 || index === 41) return 'EXCEPTION_MISSING_PO';
  if (index === 27 || index === 53) return 'EXCEPTION_DUPLICATE_PAYMENT';
  if (index === 37 || index === 49) return 'EXCEPTION_UNKNOWN_COUNTERPARTY';

  // Solvable variants
  if (index % 5 === 0) return 'CLEAN_TDS_ADJUSTED';
  if (index % 3 === 0) return 'CLEAN_FUZZY_ALIAS';
  return 'CLEAN_EXACT';
}

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}
