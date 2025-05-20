import express from 'express';
import multer from 'multer';
import { createPost, getAllPosts, getArchivedPost, getDeletedPost, getDraftPost, updatePostStatus, getPostById, updatePost, getPost, getAllPostsByCategory, getPostsByTag, getFearuredPost, getNoOfViews, getAllPost, addViews, addLikes, getTrendingPosts, getLatestPosts, getPopularPosts, getTopCategories } from '../controllers/PostController';
import { protect } from '../middleware/AuthMiddleware';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('image');

router.post('/post/create', protect, upload, createPost);

router.get('/post/published', protect, getAllPosts);
router.get('/:slug', getPost);
router.get('/post/id/:id', getPostById);
router.get('/post/category/:category', getAllPostsByCategory);
router.get('/post/tag/:tag', getPostsByTag);
router.get('/post/archived', protect, getArchivedPost);
router.get('/post/draft', protect, getDraftPost);
router.get('/post/features', getFearuredPost);
router.get('/post/views/:id', getNoOfViews);
router.get('/post/deleted', protect, getDeletedPost);
router.put('/post/update/:id', protect, upload, updatePost);
router.get('/post/all', getAllPost);
router.get('/post/trending', getTrendingPosts);
router.get('/post/latest', getLatestPosts);
router.get('/post/popular', getPopularPosts)
router.get('/post/top-categories', getTopCategories)

router.patch('/post/status/:id', protect, updatePostStatus);

router.put('/post/views', addViews);
router.put('/post/likes', addLikes);

export default router;