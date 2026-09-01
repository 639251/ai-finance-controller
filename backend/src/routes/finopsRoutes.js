import express from 'express';
import {
  getBatchData,
  regenerateBatch,
  runFinOpsLoop,
  resolveException,
  exportFinOpsReport,
  uploadCustomBatch
} from '../controllers/finopsController.js';

const router = express.Router();

router.get('/batch', getBatchData);
router.post('/regenerate', regenerateBatch);
router.post('/upload-batch', uploadCustomBatch);
router.post('/run-loop', runFinOpsLoop);
router.post('/resolve-exception', resolveException);
router.get('/export', exportFinOpsReport);

export default router;
