import { generateSyntheticFinOpsBatch } from '../services/syntheticDataGenerator.js';
import { executeFinOpsLoop } from '../services/finopsReconciliationAgent.js';

// In-memory active batch store
let activeBatch = generateSyntheticFinOpsBatch(60);
let lastLoopResult = executeFinOpsLoop(activeBatch);

export const getBatchData = (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        metadata: activeBatch.batchMetadata,
        invoices: activeBatch.invoices,
        bankSettlements: activeBatch.bankSettlements,
        purchaseOrders: activeBatch.purchaseOrders
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const regenerateBatch = (req, res) => {
  try {
    const count = parseInt(req.body.count) || 60;
    activeBatch = generateSyntheticFinOpsBatch(count);
    lastLoopResult = executeFinOpsLoop(activeBatch);

    res.json({
      success: true,
      message: `Generated fresh synthetic batch with ${count} records.`,
      data: {
        metadata: activeBatch.batchMetadata,
        loopResult: lastLoopResult
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const runFinOpsLoop = (req, res) => {
  try {
    lastLoopResult = executeFinOpsLoop(activeBatch);
    res.json({
      success: true,
      message: 'Autonomous FinOps reconciliation loop executed successfully.',
      data: lastLoopResult
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resolveException = (req, res) => {
  try {
    const { exceptionId, resolutionType, resolutionNotes, waiverAmount } = req.body;

    if (!exceptionId) {
      return res.status(400).json({ success: false, message: 'Exception ID is required.' });
    }

    const excIndex = lastLoopResult.exceptions.findIndex(e => e.exceptionId === exceptionId);
    if (excIndex === -1) {
      return res.status(404).json({ success: false, message: 'Exception record not found.' });
    }

    const targetExc = lastLoopResult.exceptions[excIndex];

    // Remove from open exceptions
    lastLoopResult.exceptions.splice(excIndex, 1);

    // Add to reconciled as Human-Resolved
    const resolvedRecord = {
      reconciliationId: `REC-HITL-${targetExc.invoiceNumber}`,
      invoiceNumber: targetExc.invoiceNumber,
      poNumber: targetExc.evidence.po?.poNumber || 'MANUALLY_ASSIGNED_PO',
      utrNumber: targetExc.evidence.settlement?.utrNumber || 'MANUAL_UTR_OVERRIDE',
      vendorName: targetExc.vendorName,
      bankCounterparty: targetExc.evidence.settlement?.counterparty || targetExc.vendorName,
      category: targetExc.category,
      invoiceAmount: targetExc.invoiceAmount,
      settlementAmount: targetExc.settlementAmount,
      settlementDate: new Date().toISOString().split('T')[0],
      source: 'HITL_CONTROLLER_OVERRIDE',
      matchType: `MANUAL RESOLUTION: ${resolutionType || 'APPROVED_WITH_WAIVER'}`,
      matchConfidence: 1.0,
      matchReasoning: resolutionNotes || `Resolved manually by Finance Controller under policy override.`,
      status: 'MANUALLY_RECONCILED',
      reconciledAt: new Date().toISOString()
    };

    lastLoopResult.reconciled.push(resolvedRecord);

    // Recalculate metrics
    const total = lastLoopResult.reconciled.length + lastLoopResult.exceptions.length;
    const newMatchRate = total > 0 ? (lastLoopResult.reconciled.length / total) * 100 : 0;
    lastLoopResult.loopSummary.autoClosedRecords = lastLoopResult.reconciled.length;
    lastLoopResult.loopSummary.unresolvedExceptions = lastLoopResult.exceptions.length;
    lastLoopResult.loopSummary.matchRate = `${newMatchRate.toFixed(1)}%`;
    lastLoopResult.loopSummary.matchRatePercent = parseFloat(newMatchRate.toFixed(1));
    lastLoopResult.loopSummary.exceptionRatePercent = parseFloat((100 - newMatchRate).toFixed(1));
    lastLoopResult.loopSummary.valueAtRisk = lastLoopResult.exceptions.reduce((sum, e) => sum + e.varianceAmount, 0);

    res.json({
      success: true,
      message: `Exception ${exceptionId} resolved successfully.`,
      data: {
        resolvedRecord,
        updatedSummary: lastLoopResult.loopSummary,
        remainingExceptions: lastLoopResult.exceptions
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const exportFinOpsReport = (req, res) => {
  try {
    res.json({
      success: true,
      report: {
        generatedAt: new Date().toISOString(),
        summary: lastLoopResult.loopSummary,
        reconciledItems: lastLoopResult.reconciled,
        unresolvedExceptions: lastLoopResult.exceptions,
        auditTrail: lastLoopResult.auditTrail
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
