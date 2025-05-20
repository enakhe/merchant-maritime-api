import { Request, Response } from 'express';
import Comment from '../model/Comment';
import expressAsyncHandler from "express-async-handler";
import Post from '../model/Post';

// Create a new comment
export const createComment = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
        const comment = new Comment(req.body);
        await comment.save();
        const post = await Post.findById(req.body.postId);
        if (post) {
            post.comments += 1;
            await post.save();
        }
        res.status(201).json(comment);
    } catch (error) {
        res.status(400)
        throw new Error("Failed to add comment");
    }
});

// Get a comment by ID
export const getCommentById = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
        const comment = await Comment.findById(req.params.id).populate('author').populate('postId');
        if (!comment) {
            res.status(404)
            throw new Error("Comment not found");
        }
        res.status(200).json(comment);
    } catch (error) {
        res.status(400)
        throw new Error("Failed to get comment");
    }
});

export const updateComment = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
        const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!comment) {
            res.status(404)
            throw new Error("Comment not found");
        }
        res.status(200).json(comment);
    } catch (error) {
        res.status(400);
        throw new Error("Failed to update comment");
    }
});

// Delete a comment by ID
export const deleteComment = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    try{
        const comment = await Comment.findByIdAndDelete(req.params.id);
        if (!comment) {
            res.status(404)
            throw new Error("Comment not found");
        }
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(400);
        throw new Error("Failed to delete comment");
    }
});

// Get all comments by post ID
export const getCommentsByPostId = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
        const comments = await Comment.find({ postId: req.params.id }).populate('author').sort({ createdAt: -1 });
        res.status(200).json(comments);
    } catch (error) {
        res.status(400);
        throw new Error("Failed to get comments");
    }
});