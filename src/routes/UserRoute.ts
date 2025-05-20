import express from 'express';
import { getAllUser, getUserById, getUserProfile, loginUser, getUserTotalPosts } from '../controllers/UserController';
import { protect } from '../middleware/AuthMiddleware';

const router = express.Router();

router.post('/login', loginUser);
router.get('/get-profile', protect, getUserProfile);
router.get('/get-all', protect, getAllUser);
router.get('/:id', protect, getUserById);
router.get('/author/posts', protect, getUserTotalPosts);
export default router;