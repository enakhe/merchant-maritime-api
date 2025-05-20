"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = require("../middleware/AuthMiddleware");
const TagController_1 = require("../controllers/TagController");
const router = express_1.default.Router();
router.post('/', AuthMiddleware_1.protect, TagController_1.createTag);
router.get('/all', TagController_1.getTags);
router.post('/category', AuthMiddleware_1.protect, TagController_1.getTagByCategory);
router.get('/:slug', AuthMiddleware_1.protect, TagController_1.getTagBySlug);
router.put('/:slug', AuthMiddleware_1.protect, TagController_1.updateTag);
router.delete('/:slug', AuthMiddleware_1.protect, TagController_1.deleteTag);
exports.default = router;
//# sourceMappingURL=TagRoute.js.map