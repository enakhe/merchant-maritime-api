import expressAsyncHandler from "express-async-handler";
import { Request, Response } from 'express';
import { ObjectId } from "mongoose";
import { validateFields } from "../utils/UtilityFunction";
import { UploadedFile } from "express-fileupload";
import { CreatePost } from "../repository/PostRepository";
import { uploadImageToPinata } from "../service/TokenService";
import User from "../model/User";
import Post from "../model/Post";
import mongoose from 'mongoose';
import { createExcerpt, createSlug } from "../service/PostService";
import { AuthenticatedRequest } from "../middleware/AuthMiddleware";
import fs from "fs";
import path from "path";
import { formatISO } from "date-fns";
import axios from "axios";

interface CreatePostRequestBody {
    title: string,
    content: string,
    categories: string,
    tags: string,
    status: string,
    image: string,
    isFeatured: boolean,
    allowComments: boolean,
    keywords: string
}

export const createPost = expressAsyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const {
        title,
        content,
        categories,
        tags,
        status,
        isFeatured,
        allowComments,
        keywords
    } = req.body as CreatePostRequestBody

    const files = req.file as { image?: UploadedFile | UploadedFile[] };
    const imageFile = Array.isArray(files) ? files[0] : files;
    const author = req.user._id;
    if (!author) {
        res.status(401);
        throw new Error("User not authenticated")
    }

    if (!validateFields(title, content, JSON.parse(categories), JSON.parse(tags), status, isFeatured, allowComments, author, imageFile)) {
        res.status(400);
        throw new Error("All fields are required and cannot be empty")
    }

    const { ipfsLink: imageIpfsLink } = await uploadImageToPinata(imageFile.buffer, imageFile.originalname);

    if (author) {
        const post = await CreatePost(title, content, JSON.parse(categories), JSON.parse(tags), keywords, status, imageIpfsLink, isFeatured, allowComments, author);
        if (post) {
            res.status(201).json(post);
        }
    }

    res.status(400);
    throw new Error("Invalid data");
});

export const getPost = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!validateFields(req.params.slug)) {
        res.status(400);
        throw new Error("Invalid slug provided");
    }

    const post = await Post.findOne({ slug: req.params.slug, status: 'published' })
        .populate('author')
        .populate('categories')
        .populate('tags');

    if (!post) {
        res.status(404);
        throw new Error("Post not found");
    }

    res.status(200).json(post);
});

export const getPostById = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!validateFields(req.params.id) && !mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error("Invalid id provided");
    }

    const post = await Post.findOne({ _id: req.params.id })
        .populate('author')
        .populate('categories')
        .populate('tags');

    if (!post) {
        res.status(404);
        throw new Error("Post not found");
    } else {
        res.status(200).json(post);
    }
})

export const getAllPostsByCategory = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { category } = req.params;

    if (!category) {
        res.status(400);
        throw new Error("Category is required");
    }

    const posts = await Post.find({ category: category, status: 'published' })
        .populate('author')
        .populate('categories')
        .populate('tags');

    res.status(200).json(posts);
});

export const getPostsByTag = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { tag } = req.params;

    if (!tag) {
        res.status(400);
        throw new Error("Tag is required");
    }

    const posts = await Post.find({ tags: tag, status: 'published' })
        .populate('author')
        .populate('categories')
        .populate('tags');

    res.status(200).json(posts);
});

export const getDraftPost = expressAsyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const id = req.user._id;
    if (!id) {
        res.status(401);
        throw new Error("User not authenticated")
    }
    const posts = await Post.find({ status: 'draft', author: id })
        .populate('author')
        .populate('categories')
        .populate('tags').sort({ createdAt: -1 });
    res.status(200).json(posts);
})

export const getAllPosts = expressAsyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const id = req.user._id;
    if (!id) {
        res.status(401);
        throw new Error("User not authenticated")
    }
    const posts = await Post.find({ status: 'published', author: id })
        .populate('author')
        .populate('categories')
        .populate('tags').sort({ createdAt: -1 });
    res.status(200).json(posts);
});

export const getArchivedPost = expressAsyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const id = req.user._id;
    if (!id) {
        res.status(401);
        throw new Error("User not authenticated")
    }
    const posts = await Post.find({ status: 'archived', author: id })
        .populate('author')
        .populate('categories')
        .populate('tags').sort({ createdAt: -1 });
    res.status(200).json(posts);
})

export const getDeletedPost = expressAsyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const id = req.user._id;
    if (!id) {
        res.status(401);
        throw new Error("User not authenticated")
    }
    const posts = await Post.find({ status: 'deleted', author: id })
        .populate('author')
        .populate('categories')
        .populate('tags').sort({ createdAt: -1 });
    res.status(200).json(posts);
})

export const getFearuredPost = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const posts = await Post.find({ isFeatured: true })
        .populate('author')
        .populate('categories')
        .populate('tags').sort({ createdAt: -1 });
    res.status(200).json(posts);
})

export const getNoOfViews = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!validateFields(req.params.id) && !mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error("Invalid id provided");
    }

    const post = await Post.findOne({ _id: req.params.id, status: 'published' })
        .populate('author')
        .populate('categories')
        .populate('tags');

    if (!post) {
        res.status(404);
        throw new Error("Post not found");
    }

    res.status(200).json({ views: post.views });
})

export const updatePostStatus = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { status } = req.body;
    const id = req.params.id;

    if (!validateFields(id, status)) {
        res.status(400);
        throw new Error("Invalid id provided or status");
    }

    const post = await Post.findById(id);

    if (!post) {
        res.status(404);
        throw new Error("Post not found");
    }

    if (["draft", "published", "archived", "deleted"].includes(status.toLowerCase())) {
        const updatedPost = await Post.findOneAndUpdate(
            { _id: post._id },
            { status: status.toLowerCase() },
            { new: true }
        )
            .populate("author")
            .populate("categories")
            .populate("tags");

        res.status(200).json(updatedPost);
    } else {
        res.status(400);
        throw new Error("Status can either be 'draft', 'published', 'archived', or 'deleted'");
    }
});


export const updatePost = expressAsyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { title, content, keywords, categories, tags, isFeatured, allowComments } = req.body;
    const id = req.user._id;

    if (!id) {
        res.status(401);
        throw new Error("User not authenticated");
    }

    const files = req.file as { image?: UploadedFile | UploadedFile[] };
    const imageFile = Array.isArray(files) ? files[0] : files;

    if (!validateFields(req.params.id, title, content)) {
        res.status(400);
        throw new Error("Invalid id or fields provided");
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
        res.status(404);
        throw new Error("Post not found");
    }

    const originalSlug = post.slug;

    const { ipfsLink: imageIpfsLink } = await uploadImageToPinata(imageFile.buffer, imageFile.originalname);

    const newSlug = createSlug(title);

    const update = {
        title,
        slug: newSlug,
        content,
        excerpt: createExcerpt(content),
        image: imageIpfsLink,
        author: id,
        categories: JSON.parse(categories),
        tags: JSON.parse(tags),
        keywords,
        isFeatured,
        metaDescription: createExcerpt(content),
        metaKeywords: tags,
        allowComments,
        updatedAt: Date.now(),
    };

    const updatedPost = await Post.findByIdAndUpdate(
        { _id: post._id },
        update,
        { new: true }
    ).populate("author")
        .populate("categories")
        .populate("tags");

    res.status(200).json(updatedPost);
});


export const deletePost = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!validateFields(req.params.id) && !mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error("Invalid id provided");
    }

    const post = await Post.findOne({ _id: req.params.id });

    if (!post) {
        res.status(404);
        throw new Error("Post not found");
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ id: req.params.id });
})

export const getAllPost = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
        const posts = await Post.find({ status: 'published' }).sort({ createdAt: -1 })
            .lean()
            .populate<{ author: { username: string } }>('author', 'username')
            .populate<{ categories: { name: string }[] }>('categories', 'name')
            .populate<{ tags: { name: string }[] }>('tags', 'name');

        const structuredPosts: Record<string, any[]> = {};

        posts.forEach(post => {
            (post.categories as { name: string }[]).forEach(category => {
                if (!structuredPosts[category.name]) {
                    structuredPosts[category.name] = [];
                }
                structuredPosts[category.name].push(post);
            });
        });
        res.status(200).json(structuredPosts);
    } catch (error) {
        res.status(500)
        throw new Error("Error fetching posts");
    }
});



export const addViews = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.body;
    if (!id) {
        res.status(404);
        throw new Error("Post id is required");
    }

    const post = await Post.findById(id);
    if (post) {
        const updatedPost = await Post.findOneAndUpdate(
            { _id: post._id },
            { views: post.views + 1 },
            { new: true }
        )
            .populate('author')
            .populate('categories')
            .populate('tags');
        res.status(200).json(updatedPost);
    } else {
        res.status(404);
        throw new Error("Post not found");
    }
})

export const addLikes = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id, liked } = req.body;
    if (!id) {
        res.status(404);
        throw new Error("Post id is required");
    }

    const post = await Post.findById(id);
    if (post) {
        if (liked) {
            post.likes += 1;
        } else {
            post.likes = Math.max(0, post.likes - 1);
        }

        await post.save();
        res.status(200).json({ likes: post.likes });
    } else {
        res.status(404);
        throw new Error("Post not found");
    }
})

export const getTrendingPosts = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
        const trendingPosts = await Post.aggregate([
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
    } catch (error) {
        res.status(500).json({ message: "Error fetching trending posts", error });
    }
});

export const getLatestPosts = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
        const latestPosts = await Post.find({ status: 'published' })
            .sort({ publishedAt: -1 })
            .limit(12)
            .lean()
            .populate<{ author: { username: string } }>('author', 'username')
            .populate<{ categories: { name: string }[] }>('categories', 'name')
            .populate<{ tags: { name: string }[] }>('tags', 'name');

        res.status(200).json(latestPosts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching latest posts", error });
    }
});

export const getPopularPosts = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
        const popularPosts = await Post.find({ status: 'published' })
            .sort({ views: -1 })
            .limit(12)
            .lean()
            .populate<{ author: { username: string } }>('author', 'username')
            .populate<{ categories: { name: string }[] }>('categories', 'name')
            .populate<{ tags: { name: string }[] }>('tags', 'name');

        res.status(200).json(popularPosts);
    } catch (error) {
        res.status(400)
        throw new Error("Error fetching popular posts");
    }
});

export const getTopCategories = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
        const topCategories = await Post.aggregate([
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
    } catch (error) {
        res.status(500).json({ message: "Error fetching top categories", error });
    }
});

async function getPublishedPostSlugs() {
    try {
        const posts = await Post.find({ status: "published" }, "slug updatedAt");
        return posts.map(post => ({
            slug: post.slug,
            lastmod: post.updatedAt.toISOString(), // Convert updatedAt to ISO format
        }));
    } catch (error) {
        console.error("Error fetching published posts:", error);
        return [];
    }
}

export const generateSitemap = async (): Promise<string> => {
    try {
        const baseUrl = "https://www.website.feteflex.com";
        const posts = await Post.find({ status: "published" }).select("slug updatedAt");

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
            sitemap += `    <lastmod>${formatISO(new Date())}</lastmod>\n`;
            sitemap += `    <changefreq>${route.changefreq}</changefreq>\n`;
            sitemap += `    <priority>${route.priority}</priority>\n`;
            sitemap += `  </url>\n`;
        });

        // **Add Blog Posts Dynamically**
        posts.forEach(post => {
            sitemap += `  <url>\n`;
            sitemap += `    <loc>${baseUrl}/news/${post.slug}</loc>\n`;
            sitemap += `    <lastmod>${formatISO(post.updatedAt)}</lastmod>\n`;
            sitemap += `    <changefreq>daily</changefreq>\n`;
            sitemap += `    <priority>1.0000</priority>\n`;
            sitemap += `  </url>\n`;
        });

        sitemap += `</urlset>`;

        // **Write to a writable location (`/tmp/sitemap.xml`)**
        const tmpPath = path.join('/tmp', 'sitemap.xml');
        fs.writeFileSync(tmpPath, sitemap, 'utf8');

        console.log("✅ Sitemap generated successfully:", tmpPath);

        return sitemap;
    } catch (error) {
        console.error("❌ Error generating sitemap:", error);
        throw new Error("Failed to generate sitemap");
    }
};
