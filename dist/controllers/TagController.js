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
exports.getTagByCategory = exports.deleteTag = exports.updateTag = exports.getTagBySlug = exports.getTags = exports.createTag = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const UtilityFunction_1 = require("../utils/UtilityFunction");
const PostService_1 = require("../service/PostService");
const Tag_1 = __importDefault(require("../model/Tag"));
exports.createTag = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, category } = req.body;
    if (!(0, UtilityFunction_1.validateFields)(name)) {
        res.status(400);
        throw new Error("All fields are required and cannot be empty");
    }
    const tag = yield Tag_1.default.findOne({
        name
    });
    if (!tag) {
        yield Tag_1.default.create({
            name,
            slug: (0, PostService_1.createSlug)(name),
            description,
            category
        });
        if (tag) {
            res.status(201).json(tag);
        }
        res.status(400);
        throw new Error("A tag with name '" + name + "' already exists");
    }
}));
exports.getTags = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tags = yield Tag_1.default.find();
    res.status(200).json(tags);
}));
exports.getTagBySlug = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    const tag = yield Tag_1.default.findOne({ slug });
    if (!tag) {
        res.status(404);
        throw new Error('Tag not found');
    }
    res.status(200).json(tag);
}));
exports.updateTag = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    const updates = req.body;
    if (updates.name) {
        updates.slug = (0, PostService_1.createSlug)(updates.name);
    }
    const updatedTag = yield Tag_1.default.findOneAndUpdate({ slug }, updates, {
        new: true,
        runValidators: true,
    });
    if (!updatedTag) {
        res.status(404);
        throw new Error('Tag not found');
    }
    res.status(200).json(updatedTag);
}));
exports.deleteTag = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    const tag = yield Tag_1.default.findOneAndDelete({ slug });
    if (!tag) {
        res.status(404);
        throw new Error('Tag not found');
    }
    res.status(200).json({ message: 'Tag deleted successfully' });
}));
exports.getTagByCategory = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category } = req.body;
    if (!category) {
        res.status(400);
        throw new Error("Category array is required");
    }
    const tags = yield Tag_1.default.find({ category: { $in: category } });
    res.status(200).json(tags);
}));
//# sourceMappingURL=TagController.js.map