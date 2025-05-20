"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const PostSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 80
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
        minlength: 250
    },
    excerpt: {
        type: String,
        default: '',
    },
    image: {
        type: String,
        default: '',
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    categories: [{
            type: Schema.Types.ObjectId,
            ref: 'Category',
        }],
    tags: [{
            type: Schema.Types.ObjectId,
            ref: 'Tag',
        }],
    keywords: {
        type: String,
        default: '',
    },
    publishedAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived', 'delete'],
        default: 'draft',
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    metaDescription: {
        type: String,
        default: '',
    },
    metaKeywords: [{
            type: String,
        }],
    allowComments: {
        type: Boolean,
        default: true,
    },
    views: {
        type: Number,
        default: 0,
    },
    comments: {
        type: Number,
        default: 0,
    },
    earnings: {
        type: Number,
        default: 0
    },
    reached_1k_views: {
        type: Boolean,
        default: false
    },
    likes: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model("Post", PostSchema);
//# sourceMappingURL=Post.js.map