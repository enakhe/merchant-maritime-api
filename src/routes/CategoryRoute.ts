import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/AuthMiddleware';
import { createCategory, getCategories, getCategoryBySlug, updateCategory, deleteCategory } from '../controllers/CategoryController';

const router = express.Router();

router.post('/', protect, createCategory);
router.get('/all', getCategories);
router.get('/:slug', getCategoryBySlug);
router.put('/:slug', updateCategory);
router.delete('/:slug', deleteCategory);

export default router;