"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommentsByPostId = exports.deleteComment = exports.updateComment = exports.getCommentById = exports.createComment = void 0;
const Comment_1 = __importDefault(require("../model/Comment"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Post_1 = __importDefault(require("../model/Post"));
// Create a new comment
exports.createComment = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comment = new Comment_1.default(req.body);
        yield comment.save();
        const post = yield Post_1.default.findById(req.body.postId);
        if (post) {
            post.comments += 1;
            yield post.save();
        }
        res.status(201).json(comment);
    }
    catch (error) {
        res.status(400);
        throw new Error("Failed to add comment");
    }
}));
// Get a comment by ID
exports.getCommentById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comment = yield Comment_1.default.findById(req.params.id).populate('author').populate('postId');
        if (!comment) {
            res.status(404);
            throw new Error("Comment not found");
        }
        res.status(200).json(comment);
    }
    catch (error) {
        res.status(400);
        throw new Error("Failed to get comment");
    }
}));
exports.updateComment = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comment = yield Comment_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!comment) {
            res.status(404);
            throw new Error("Comment not found");
        }
        res.status(200).json(comment);
    }
    catch (error) {
        res.status(400);
        throw new Error("Failed to update comment");
    }
}));
// Delete a comment by ID
exports.deleteComment = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comment = yield Comment_1.default.findByIdAndDelete(req.params.id);
        if (!comment) {
            res.status(404);
            throw new Error("Comment not found");
        }
        res.status(200).json({ message: 'Comment deleted successfully' });
    }
    catch (error) {
        res.status(400);
        throw new Error("Failed to delete comment");
    }
}));
// Get all comments by post ID
exports.getCommentsByPostId = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comments = yield Comment_1.default.find({ postId: req.params.id }).populate('author').sort({ createdAt: -1 });
        res.status(200).json(comments);
    }
    catch (error) {
        res.status(400);
        throw new Error("Failed to get comments");
    }
}));
//# sourceMappingURL=CommentController.js.map