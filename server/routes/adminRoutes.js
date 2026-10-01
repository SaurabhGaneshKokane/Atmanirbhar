import express from 'express';
import {
  getAdminMetrics,
  getPendingVerifications,
  verifyFarmer,
  moderateProduct,
} from '../controllers/adminController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// All admin routes require authentication and 'admin' role
router.use(protect, restrictTo('admin'));

router.get('/metrics', getAdminMetrics);
router.get('/verifications', getPendingVerifications);
router.patch('/verify/:farmerId', verifyFarmer);
router.patch('/moderation/:productId', moderateProduct);

export default router;
