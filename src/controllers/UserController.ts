import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from "../model/User";
import { AuthenticatedRequest } from "../middleware/AuthMiddleware";
import Post from "../model/Post";

interface LoginRequestBody {
    email: string;
    password: string;
}

export const loginUser = expressAsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const { email, password } = req.body as LoginRequestBody;

        if (!email || !password) {
            res.status(404);
            throw new Error("Failed to login, wallet or public key missing");
        }

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.status(200).json({
                _id: user.id,
                name: user.username,
                email: user.email,
                token: generateToken(user._id.toString())
            })
        } else {
            res.status(400);
            throw new Error(`Invalid credentials`);
        }
    }
);

export const getUserProfile = expressAsyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {

        const id = req.user._id;
        if (!id) {
            res.status(401);
            throw new Error("User not authenticated");
        }

        const user = await User.findById(id);

        if (!user) {
            res.status(404);
            throw new Error("User not found");
        }

        res.status(200).json(user);
    }
);

export const getAllUser = expressAsyncHandler(
    async (req: Request, res: Response) => {
        const users = await User.find();
        res.status(200).json(users);
    }
);

export const getUserById = expressAsyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const id = req.user._id;

        if (!id) {
            res.status(401);
            throw new Error("User not authenticated");
        }

        if (!id) {
            res.status(400);
            throw new Error("User ID is required");
        }

        const user = await User.findById(id);
        if (!user) {
            res.status(404);
            throw new Error("User not found");
        }

        res.status(200).json(user);
    }
);

export const getUserTotalPosts = expressAsyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        try {
            const id = req.user._id;
            if (!id) {
                res.status(401);
                throw new Error("User not authenticated");
            }
            const posts = await Post.find({ author: id, status: "published" })
                .populate("author")
                .populate("categories")
                .populate("tags")
                .sort({ createdAt: -1 });

            res.status(200).json(posts);
        } catch (error) {
            res.status(500);
            throw new Error("Failed to fetch all author posts");
        }
    }
);

const getAuthorStatsForPublishedArticles = async (authorId: string) => {
    try {
        const result = await Post.aggregate([
            {
                $match: {
                    author: new mongoose.Types.ObjectId(authorId),
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
    } catch (error) {
        console.error("Error fetching author stats for published articles:", error);
        throw error;
    }
};

const generateToken = (id: string) => {

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }

    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};


