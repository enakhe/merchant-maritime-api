import expressAsyncHandler from "express-async-handler";
import { Request, Response } from 'express';
import { validateFields } from "../utils/UtilityFunction";
import { createSlug } from "../service/PostService";
import Tag from "../model/Tag";

interface CreateTagReq {
    name: string,
    description: string,
    category: string
}

interface GetTagByCategory {
    category: string[]
}

export const createTag = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { name, description, category } = req.body as CreateTagReq;
    if (!validateFields(name)) {
        res.status(400);
        throw new Error("All fields are required and cannot be empty")
    }

    const tag = await Tag.findOne({
        name
    });
    if (!tag) {
        await Tag.create({
            name,
            slug: createSlug(name),
            description,
            category
        });
        if (tag) {
            res.status(201).json(tag);
        }
        res.status(400);
        throw new Error("A tag with name '" + name + "' already exists");
    }
});

export const getTags = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const tags = await Tag.find();
    res.status(200).json(tags);
});

export const getTagBySlug = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params;

    const tag = await Tag.findOne({ slug });

    if (!tag) {
        res.status(404);
        throw new Error('Tag not found');
    }

    res.status(200).json(tag);
});

export const updateTag = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params;
    const updates = req.body;

    if (updates.name) {
        updates.slug = createSlug(updates.name);
    }

    const updatedTag = await Tag.findOneAndUpdate({ slug }, updates, {
        new: true,
        runValidators: true,
    });

    if (!updatedTag) {
        res.status(404);
        throw new Error('Tag not found');
    }

    res.status(200).json(updatedTag);
});

export const deleteTag = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params;

    const tag = await Tag.findOneAndDelete({ slug });

    if (!tag) {
        res.status(404);
        throw new Error('Tag not found');
    }

    res.status(200).json({ message: 'Tag deleted successfully' });
});

export const getTagByCategory = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { category } = req.body;

    if (!category) {
        res.status(400)
        throw new Error ("Category array is required");
    }

    const tags = await Tag.find({ category: { $in: category } });
    res.status(200).json(tags);
});