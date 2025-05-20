"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = require("../controllers/UserController");
const AuthMiddleware_1 = require("../middleware/AuthMiddleware");
const router = express_1.default.Router();
router.post('/login', UserController_1.loginUser);
router.get('/get-profile', AuthMiddleware_1.protect, UserController_1.getUserProfile);
router.get('/get-all', AuthMiddleware_1.protect, UserController_1.getAllUser);
router.get('/:id', AuthMiddleware_1.protect, UserController_1.getUserById);
router.get('/author/posts', AuthMiddleware_1.protect, UserController_1.getUserTotalPosts);
exports.default = router;
//# sourceMappingURL=UserRoute.js.map