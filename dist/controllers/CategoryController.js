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
exports.deleteCategory = exports.updateCategory = exports.getCategoryBySlug = exports.getCategories = exports.createCategory = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const UtilityFunction_1 = require("../utils/UtilityFunction");
const Category_1 = __importDefault(require("../model/Category"));
const PostService_1 = require("../service/PostService");
exports.createCategory = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = req.body;
    if (!(0, UtilityFunction_1.validateFields)(name, description)) {
        res.status(400);
        throw new Error("All fields are required and cannot be empty");
    }
    let category = yield Category_1.default.findOne({ name });
    if (!category) {
        yield Category_1.default.create({ name, description, slug: (0, PostService_1.createSlug)(name) });
        res.status(201).json(category);
    }
    else {
        res.status(400);
        throw new Error("A category with name '" + name + "' already exists");
    }
}));
exports.getCategories = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield Category_1.default.find();
    res.status(200).json(categories);
}));
exports.getCategoryBySlug = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    const category = yield Category_1.default.findOne({ slug });
    if (!category) {
        res.status(404);
        throw new Error('Category not found');
    }
    res.status(200).json(category);
}));
exports.updateCategory = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    const updates = req.body;
    if (updates.name) {
        updates.slug = (0, PostService_1.createSlug)(updates.name);
    }
    const updatedCategory = yield Category_1.default.findOneAndUpdate({ slug }, updates, {
        new: true,
        runValidators: true,
    });
    if (!updatedCategory) {
        res.status(404);
        throw new Error('Category not found');
    }
    res.status(200).json(updatedCategory);
}));
exports.deleteCategory = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    const category = yield Category_1.default.findOneAndDelete({ slug });
    if (!category) {
        res.status(404);
        throw new Error('Category not found');
    }
    res.status(200).json({ message: 'Category deleted successfully' });
}));
//# sourceMappingURL=CategoryController.js.map