import express from 'express';
import {
  register,
  login,
  getMe,
  demoLogin,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Authentication Endpoints
router.post('/register', register);
router.post('/login', login);
router.post('/demo-login', demoLogin);

// Protected User Profile Endpoint
router.get('/me', protect, getMe);

export default router;
