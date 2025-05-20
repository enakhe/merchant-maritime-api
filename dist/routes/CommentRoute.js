"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CommentController_1 = require("../controllers/CommentController");
const router = express_1.default.Router();
// Add a new comment
router.post('/add', CommentController_1.createComment);
// Get all comments
router.get('/:id', CommentController_1.getCommentsByPostId);
// Update a comment
router.put('/update/:id', CommentController_1.updateComment);
// Delete a comment
router.delete('/delete/:id', CommentController_1.deleteComment);
exports.default = router;
//# sourceMappingURL=CommentRoute.js.map