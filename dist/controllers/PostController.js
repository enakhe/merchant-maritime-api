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
exports.generateSitemap = exports.getTopCategories = exports.getPopularPosts = exports.getLatestPosts = exports.getTrendingPosts = exports.addLikes = exports.addViews = exports.getAllPost = exports.deletePost = exports.updatePost = exports.updatePostStatus = exports.getNoOfViews = exports.getFearuredPost = exports.getDeletedPost = exports.getArchivedPost = exports.getAllPosts = exports.getDraftPost = exports.getPostsByTag = exports.getAllPostsByCategory = exports.getPostById = exports.getPost = exports.createPost = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const UtilityFunction_1 = require("../utils/UtilityFunction");
const PostRepository_1 = require("../repository/PostRepository");
const TokenService_1 = require("../service/TokenService");
const Post_1 = __importDefault(require("../model/Post"));
const mongoose_1 = __importDefault(require("mongoose"));
const PostService_1 = require("../service/PostService");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const date_fns_1 = require("date-fns");
exports.createPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, categories, tags, status, isFeatured, allowComments, keywords } = req.body;
    const files = req.file;
    const imageFile = Array.isArray(files) ? files[0] : files;
    const author = req.user._id;
    if (!author) {
        res.status(401);
        throw new Error("User not authenticated");
    }
    if (!(0, UtilityFunction_1.validateFields)(title, content, JSON.parse(categories), JSON.parse(tags), status, isFeatured, allowComments, author, imageFile)) {
        res.status(400);
        throw new Error("All fields are required and cannot be empty");
    }
    const { ipfsLink: imageIpfsLink } = yield (0, TokenService_1.uploadImageToPinata)(imageFile.buffer, imageFile.originalname);
    if (author) {
        const post = yield (0, PostRepository_1.CreatePost)(title, content, JSON.parse(categories), JSON.parse(tags), keywords, status, imageIpfsLink, isFeatured, allowComments, author);
        if (post) {
            res.status(201).json(post);
        }
    }
    res.status(400);
    throw new Error("Invalid data");
}));
exports.getPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, UtilityFunction_1.validateFields)(req.params.slug)) {
        res.status(400);
        throw new Error("Invalid slug provided");
    }
    const post = yield Post_1.default.findOne({ slug: req.params.slug, status: 'published' })
        .populate('author')
        .populate('categories')
        .populate('tags');
    if (!post) {
        res.status(404);
        throw new Error("Post not found");
    }
    res.status(200).json(post);
}));
exports.getPostById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, UtilityFunction_1.validateFields)(req.params.id) && !mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error("Invalid id provided");
    }
    const post = yield Post_1.default.findOne({ _id: req.params.id })
        .populate('author')
        .populate('categories')
        .populate('tags');
    if (!post) {
        res.status(404);
        throw new Error("Post not found");
    }
    else {
        res.status(200).json(post);
    }
}));
exports.getAllPostsByCategory = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category } = req.params;
    if (!category) {
        res.status(400);
        throw new Error("Category is required");
    }
    const posts = yield Post_1.default.find({ category: category, status: 'published' })
        .populate('author')
        .populate('categories')
        .populate('tags');
    res.status(200).json(posts);
}));
exports.getPostsByTag = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tag } = req.params;
    if (!tag) {
        res.status(400);
        throw new Error("Tag is required");
    }
    const posts = yield Post_1.default.find({ tags: tag, status: 'published' })
        .populate('author')
        .populate('categories')
        .populate('tags');
    res.status(200).json(posts);
}));
exports.getDraftPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user._id;
    if (!id) {
        res.status(401);
        throw new Error("User not authenticated");
    }
    const posts = yield Post_1.default.find({ status: 'draft', author: id })
        .populate('author')
        .populate('categories')
        .populate('tags').sort({ createdAt: -1 });
    res.status(200).json(posts);
}));
exports.getAllPosts = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user._id;
    if (!id) {
        res.status(401);
        throw new Error("User not authenticated");
    }
    const posts = yield Post_1.default.find({ status: 'published', author: id })
        .populate('author')
        .populate('categories')
        .populate('tags').sort({ createdAt: -1 });
    res.status(200).json(posts);
}));
exports.getArchivedPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user._id;
    if (!id) {
        res.status(401);
        throw new Error("User not authenticated");
    }
    const posts = yield Post_1.default.find({ status: 'archived', author: id })
        .populate('author')
        .populate('categories')
        .populate('tags').sort({ createdAt: -1 });
    res.status(200).json(posts);
}));
exports.getDeletedPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user._id;
    if (!id) {
        res.status(401);
        throw new Error("User not authenticated");
    }
    const posts = yield Post_1.default.find({ status: 'deleted', author: id })
        .populate('author')
        .populate('categories')
        .populate('tags').sort({ createdAt: -1 });
    res.status(200).json(posts);
}));
exports.getFearuredPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield Post_1.default.find({ isFeatured: true })
        .populate('author')
        .populate('categories')
        .populate('tags').sort({ createdAt: -1 });
    res.status(200).json(posts);
}));
exports.getNoOfViews = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, UtilityFunction_1.validateFields)(req.params.id) && !mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error("Invalid id provided");
    }
    const post = yield Post_1.default.findOne({ _id: req.params.id, status: 'published' })
        .populate('author')
        .populate('categories')
        .populate('tags');
    if (!post) {
        res.status(404);
        throw new Error("Post not found");
    }
    res.status(200).json({ views: post.views });
}));
exports.updatePostStatus = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = req.body;
    const id = req.params.id;
    if (!(0, UtilityFunction_1.validateFields)(id, status)) {
        res.status(400);
        throw new Error("Invalid id provided or status");
    }
    const post = yield Post_1.default.findById(id);
    if (!post) {
        res.status(404);
        throw new Error("Post not found");
    }
    if (["draft", "published", "archived", "deleted"].includes(status.toLowerCase())) {
        const updatedPost = yield Post_1.default.findOneAndUpdate({ _id: post._id }, { status: status.toLowerCase() }, { new: true })
            .populate("author")
            .populate("categories")
            .populate("tags");
        res.status(200).json(updatedPost);
    }
    else {
        res.status(400);
        throw new Error("Status can either be 'draft', 'published', 'archived', or 'deleted'");
    }
}));
exports.updatePost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, keywords, categories, tags, isFeatured, allowComments } = req.body;
    const id = req.user._id;
    if (!id) {
        res.status(401);
        throw new Error("User not authenticated");
    }
    const files = req.file;
    const imageFile = Array.isArray(files) ? files[0] : files;
    if (!(0, UtilityFunction_1.validateFields)(req.params.id, title, content)) {
        res.status(400);
        throw new Error("Invalid id or fields provided");
    }
    const post = yield Post_1.default.findById(req.params.id);
    if (!post) {
        res.status(404);
        throw new Error("Post not found");
    }
    const originalSlug = post.slug;
    const { ipfsLink: imageIpfsLink } = yield (0, TokenService_1.uploadImageToPinata)(imageFile.buffer, imageFile.originalname);
    const newSlug = (0, PostService_1.createSlug)(title);
    const update = {
        title,
        slug: newSlug,
        content,
        excerpt: (0, PostService_1.createExcerpt)(content),
        image: imageIpfsLink,
        author: id,
        categories: JSON.parse(categories),
        tags: JSON.parse(tags),
        keywords,
        isFeatured,
        metaDescription: (0, PostService_1.createExcerpt)(content),
        metaKeywords: tags,
        allowComments,
        updatedAt: Date.now(),
    };
    const updatedPost = yield Post_1.default.findByIdAndUpdate({ _id: post._id }, update, { new: true }).populate("author")
        .populate("categories")
        .populate("tags");
    res.status(200).json(updatedPost);
}));
exports.deletePost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, UtilityFunction_1.validateFields)(req.params.id) && !mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error("Invalid id provided");
    }
    const post = yield Post_1.default.findOne({ _id: req.params.id });
    if (!post) {
        res.status(404);
        throw new Error("Post not found");
    }
    yield Post_1.default.findByIdAndDelete(req.params.id);
    res.status(200).json({ id: req.params.id });
}));
exports.getAllPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield Post_1.default.find({ status: 'published' }).sort({ createdAt: -1 })
            .lean()
            .populate('author', 'username')
            .populate('categories', 'name')
            .populate('tags', 'name');
        const structuredPosts = {};
        posts.forEach(post => {
            post.categories.forEach(category => {
                if (!structuredPosts[category.name]) {
                    structuredPosts[category.name] = [];
                }
                structuredPosts[category.name].push(post);
            });
        });
        res.status(200).json(structuredPosts);
    }
    catch (error) {
        res.status(500);
        throw new Error("Error fetching posts");
    }
}));
exports.addViews = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    if (!id) {
        res.status(404);
        throw new Error("Post id is required");
    }
    const post = yield Post_1.default.findById(id);
    if (post) {
        const updatedPost = yield Post_1.default.findOneAndUpdate({ _id: post._id }, { views: post.views + 1 }, { new: true })
            .populate('author')
            .populate('categories')
            .populate('tags');
        res.status(200).json(updatedPost);
    }
    else {
        res.status(404);
        throw new Error("Post not found");
    }
}));
exports.addLikes = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, liked } = req.body;
    if (!id) {
        res.status(404);
        throw new Error("Post id is required");
    }
    const post = yield Post_1.default.findById(id);
    if (post) {
        if (liked) {
            post.likes += 1;
        }
        else {
            post.likes = Math.max(0, post.likes - 1);
        }
        yield post.save();
        res.status(200).json({ likes: post.likes });
    }
    else {
        res.status(404);
        throw new Error("Post not found");
    }
}));
exports.getTrendingPosts = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trendingPosts = yield Post_1.default.aggregate([
            { $match: { status: 'published' } },
            {
                $addFields: {
                    engagementScore: { $add: ["$likes", "$comments"] }
                }
            },
            { $sort: { engagementScore: -1 } },
            { $limit: 12 },
            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "author"
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categories",
                    foreignField: "_id",
                    as: "categories"
                }
            },
            {
                $lookup: {
                    from: "tags",
                    localField: "tags",
                    foreignField: "_id",
                    as: "tags"
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    slug: 1,
                    excerpt: 1,
                    content: 1,
                    image: 1,
                    publishedAt: 1,
                    views: 1,
                    likes: 1,
                    comments: 1,
                    engagementScore: 1,
                    author: { _id: 1, username: 1 },
                    categories: { _id: 1, name: 1 },
                    tags: { _id: 1, name: 1 }
                }
            }
        ]);
        res.status(200).json(trendingPosts);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching trending posts", error });
    }
}));
exports.getLatestPosts = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const latestPosts = yield Post_1.default.find({ status: 'published' })
            .sort({ publishedAt: -1 })
            .limit(12)
            .lean()
            .populate('author', 'username')
            .populate('categories', 'name')
            .populate('tags', 'name');
        res.status(200).json(latestPosts);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching latest posts", error });
    }
}));
exports.getPopularPosts = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const popularPosts = yield Post_1.default.find({ status: 'published' })
            .sort({ views: -1 })
            .limit(12)
            .lean()
            .populate('author', 'username')
            .populate('categories', 'name')
            .populate('tags', 'name');
        res.status(200).json(popularPosts);
    }
    catch (error) {
        res.status(400);
        throw new Error("Error fetching popular posts");
    }
}));
exports.getTopCategories = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topCategories = yield Post_1.default.aggregate([
            { $match: { status: 'published' } },
            { $unwind: "$categories" },
            {
                $group: {
                    _id: "$categories",
                    postCount: { $sum: 1 },
                    posts: { $push: "$$ROOT" }
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "_id",
                    foreignField: "_id",
                    as: "categoryDetails"
                }
            },
            { $unwind: "$categoryDetails" },
            { $sort: { postCount: -1 } },
            { $limit: 4 },
            {
                $project: {
                    _id: 1,
                    postCount: 1,
                    categoryDetails: 1,
                    posts: {
                        _id: 1,
                        title: 1,
                        author: 1,
                        categories: 1,
                        views: 1,
                        likes: 1,
                        comments: 1,
                        createdAt: 1
                    }
                }
            }
        ]);
        res.status(200).json(topCategories);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching top categories", error });
    }
}));
function getPublishedPostSlugs() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const posts = yield Post_1.default.find({ status: "published" }, "slug updatedAt");
            return posts.map(post => ({
                slug: post.slug,
                lastmod: post.updatedAt.toISOString(), // Convert updatedAt to ISO format
            }));
        }
        catch (error) {
            console.error("Error fetching published posts:", error);
            return [];
        }
    });
}
const generateSitemap = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const baseUrl = "https://www.website.feteflex.com";
        const posts = yield Post_1.default.find({ status: "published" }).select("slug updatedAt");
        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;
        // **Default Static Routes**
        const staticRoutes = [
            { loc: `${baseUrl}/`, priority: '1.0000', changefreq: "daily" },
            { loc: `${baseUrl}/create`, priority: '1.0000', changefreq: "daily" },
            { loc: `${baseUrl}/promote`, priority: '1.0000', changefreq: "weekly" },
            { loc: `${baseUrl}/trending`, priority: '1.0000', changefreq: "weekly" },
            { loc: `${baseUrl}/news`, priority: '1.0000', changefreq: "daily" },
            { loc: `${baseUrl}/affiliate`, priority: '1.0000', changefreq: "weekly" },
        ];
        // Add static routes
        staticRoutes.forEach(route => {
            sitemap += `  <url>\n`;
            sitemap += `    <loc>${route.loc}</loc>\n`;
            sitemap += `    <lastmod>${(0, date_fns_1.formatISO)(new Date())}</lastmod>\n`;
            sitemap += `    <changefreq>${route.changefreq}</changefreq>\n`;
            sitemap += `    <priority>${route.priority}</priority>\n`;
            sitemap += `  </url>\n`;
        });
        // **Add Blog Posts Dynamically**
        posts.forEach(post => {
            sitemap += `  <url>\n`;
            sitemap += `    <loc>${baseUrl}/news/${post.slug}</loc>\n`;
            sitemap += `    <lastmod>${(0, date_fns_1.formatISO)(post.updatedAt)}</lastmod>\n`;
            sitemap += `    <changefreq>daily</changefreq>\n`;
            sitemap += `    <priority>1.0000</priority>\n`;
            sitemap += `  </url>\n`;
        });
        sitemap += `</urlset>`;
        // **Write to a writable location (`/tmp/sitemap.xml`)**
        const tmpPath = path_1.default.join('/tmp', 'sitemap.xml');
        fs_1.default.writeFileSync(tmpPath, sitemap, 'utf8');
        console.log("✅ Sitemap generated successfully:", tmpPath);
        return sitemap;
    }
    catch (error) {
        console.error("❌ Error generating sitemap:", error);
        throw new Error("Failed to generate sitemap");
    }
});
exports.generateSitemap = generateSitemap;
//# sourceMappingURL=PostController.js.map