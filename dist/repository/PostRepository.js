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
exports.CreatePost = void 0;
const Post_1 = __importDefault(require("../model/Post"));
const PostService_1 = require("../service/PostService");
const CreatePost = (title, content, categories, tags, keywords, status, image, isFeatured, allowComments, author) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield Post_1.default.create({
        title,
        slug: (0, PostService_1.createSlug)(title),
        content,
        excerpt: (0, PostService_1.createExcerpt)(content),
        image,
        author,
        categories,
        tags,
        keywords,
        status,
        isFeatured,
        metaDescription: (0, PostService_1.createMetaDescription)(content),
        metaKeywords: tags.map(tag => tag.toString()),
        allowComments,
    });
    return post;
});
exports.CreatePost = CreatePost;
//# sourceMappingURL=PostRepository.js.map