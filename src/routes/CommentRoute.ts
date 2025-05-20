import express from 'express';
import { createComment, updateComment, deleteComment, getCommentsByPostId } from '../controllers/CommentController';

const router = express.Router();

// Add a new comment
router.post('/add', createComment);

// Get all comments
router.get('/:id', getCommentsByPostId);

// Update a comment
router.put('/update/:id', updateComment);

// Delete a comment
router.delete('/delete/:id', deleteComment);

export default router;