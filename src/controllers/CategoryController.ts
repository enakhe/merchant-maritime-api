import expressAsyncHandler from "express-async-handler";
import { validateFields } from "../utils/UtilityFunction";
import { Request, Response } from 'express';
import Category from "../model/Category";
import { createSlug } from "../service/PostService";
import mongoose from "mongoose";

interface CreateCategoryReq {
    name: string, 
    description: string
}

export const createCategory = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { name, description } = req.body as CreateCategoryReq;
    if (!validateFields(name, description)) {
        res.status(400);
        throw new Error("All fields are required and cannot be empty")
    }

    let category = await Category.findOne({ name });
    if (!category) {
        await Category.create({ name, description, slug: createSlug(name) });
        res.status(201).json(category);
    } else {
        res.status(400);
        throw new Error("A category with name '" + name + "' already exists");
    }
})

export const getCategories = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const categories = await Category.find();
    res.status(200).json(categories);
});

export const getCategoryBySlug = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params;

    const category = await Category.findOne({ slug });

    if (!category) {
        res.status(404);
        throw new Error('Category not found');
    }

    res.status(200).json(category);
});

export const updateCategory = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params;
    const updates = req.body;

    if (updates.name) {
        updates.slug = createSlug(updates.name);
    }

    const updatedCategory = await Category.findOneAndUpdate({ slug }, updates, {
        new: true,
        runValidators: true,
    });

    if (!updatedCategory) {
        res.status(404);
        throw new Error('Category not found');
    }

    res.status(200).json(updatedCategory);
});

export const deleteCategory = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params;

    const category = await Category.findOneAndDelete({ slug });

    if (!category) {
        res.status(404);
        throw new Error('Category not found');
    }

    res.status(200).json({ message: 'Category deleted successfully' });
});

