import express from 'express';
import { getInsightsAndAlerts, markNotificationAsRead } from '../controllers/insightController.js';

const router = express.Router();

// GET /api/insights - Retrieve smart alerts, velocity warnings & personalized tips
router.get('/', getInsightsAndAlerts);

// PATCH /api/insights/notifications/:id/read - Mark notification as read
router.patch('/notifications/:id/read', markNotificationAsRead);

export default router;
