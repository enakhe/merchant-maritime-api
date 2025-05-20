import express from 'express';
import { protect } from '../middleware/AuthMiddleware';
import { createTag, deleteTag, getTagByCategory, getTagBySlug, getTags, updateTag } from '../controllers/TagController';

const router = express.Router();
router.post('/', protect, createTag);
router.get('/all', getTags);
router.post('/category', protect, getTagByCategory);
router.get('/:slug', protect, getTagBySlug);
router.put('/:slug', protect, updateTag);
router.delete('/:slug', protect, deleteTag);

export default router;
