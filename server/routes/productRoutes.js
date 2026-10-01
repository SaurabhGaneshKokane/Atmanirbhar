import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  toggleStockStatus,
} from '../controllers/productController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected routes (Farmer only)
router.post('/', protect, restrictTo('farmer'), createProduct);
router.patch('/:id/stock', protect, restrictTo('farmer'), toggleStockStatus);

export default router;
