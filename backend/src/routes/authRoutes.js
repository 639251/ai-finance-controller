import express from 'express';
import { signup, login, getCurrentUser, updateProfile } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', getCurrentUser);
router.put('/profile', updateProfile);

export default router;
