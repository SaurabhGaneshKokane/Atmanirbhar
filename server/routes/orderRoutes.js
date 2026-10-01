import express from 'express';
import {
  createOrder,
  getFarmerOrders,
  getConsumerOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected Consumer routes
router.post('/', protect, restrictTo('consumer'), createOrder);
router.get('/my', protect, restrictTo('consumer'), getConsumerOrders);

// Protected Farmer routes
router.get('/farmer', protect, restrictTo('farmer'), getFarmerOrders);

// Protected Status update (Farmer or Admin)
router.patch('/:id/status', protect, restrictTo('farmer', 'admin'), updateOrderStatus);

export default router;
