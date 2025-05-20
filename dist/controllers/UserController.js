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
exports.getUserTotalPosts = exports.getUserById = exports.getAllUser = exports.getUserProfile = exports.loginUser = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../model/User"));
const Post_1 = __importDefault(require("../model/Post"));
exports.loginUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(404);
        throw new Error("Failed to login, wallet or public key missing");
    }
    const user = yield User_1.default.findOne({ email });
    if (user && (yield bcryptjs_1.default.compare(password, user.password))) {
        res.status(200).json({
            _id: user.id,
            name: user.username,
            email: user.email,
            token: generateToken(user._id.toString())
        });
    }
    else {
        res.status(400);
        throw new Error(`Invalid credentials`);
    }
}));
exports.getUserProfile = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user._id;
    if (!id) {
        res.status(401);
        throw new Error("User not authenticated");
    }
    const user = yield User_1.default.findById(id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    res.status(200).json(user);
}));
exports.getAllUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield User_1.default.find();
    res.status(200).json(users);
}));
exports.getUserById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user._id;
    if (!id) {
        res.status(401);
        throw new Error("User not authenticated");
    }
    if (!id) {
        res.status(400);
        throw new Error("User ID is required");
    }
    const user = yield User_1.default.findById(id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    res.status(200).json(user);
}));
exports.getUserTotalPosts = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.user._id;
        if (!id) {
            res.status(401);
            throw new Error("User not authenticated");
        }
        const posts = yield Post_1.default.find({ author: id, status: "published" })
            .populate("author")
            .populate("categories")
            .populate("tags")
            .sort({ createdAt: -1 });
        res.status(200).json(posts);
    }
    catch (error) {
        res.status(500);
        throw new Error("Failed to fetch all author posts");
    }
}));
const getAuthorStatsForPublishedArticles = (authorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Post_1.default.aggregate([
            {
                $match: {
                    author: new mongoose_1.default.Types.ObjectId(authorId),
                    status: "published",
                },
            },
            {
                $group: {
                    _id: null,
                    totalComments: { $sum: "$comments" },
                    totalViews: { $sum: "$views" },
                    totalLikes: { $sum: "$likes" },
                },
            },
        ]);
        if (result.length === 0) {
            return {
                totalComments: 0,
                totalViews: 0,
                totalLikes: 0,
            };
        }
        return result[0];
    }
    catch (error) {
        console.error("Error fetching author stats for published articles:", error);
        throw error;
    }
});
const generateToken = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};
//# sourceMappingURL=UserController.js.map