"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = require("../middleware/AuthMiddleware");
const CategoryController_1 = require("../controllers/CategoryController");
const router = express_1.default.Router();
router.post('/', AuthMiddleware_1.protect, CategoryController_1.createCategory);
router.get('/all', CategoryController_1.getCategories);
router.get('/:slug', CategoryController_1.getCategoryBySlug);
router.put('/:slug', CategoryController_1.updateCategory);
router.delete('/:slug', CategoryController_1.deleteCategory);
exports.default = router;
//# sourceMappingURL=CategoryRoute.js.map