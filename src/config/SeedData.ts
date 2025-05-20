import Category from '../model/Category';
import Tag from '../model/Tag';
import User from "../model/User";
import bcrypt from 'bcryptjs';
import { CATEGORIES, TAGS } from '../types';
import { createSlug } from '../service/PostService';

export const seedCategories = async () => {
    try {
        for (const category of CATEGORIES) {
            const categoryExists = await Category.findOne({ name: category.name });
            if (!categoryExists) {
                await Category.create({
                    name: category.name,
                    description: category.description,
                    slug: createSlug(category.name)
                });
            }
        }
        console.log("✅ Categories seeded successfully!");
    } catch (error) {
        console.error("❌ Error seeding categories:", error);
    }
};

export const seedTags = async () => {
    try {
        for (const tagGroup of TAGS) {
            const category = await Category.findOne({ name: tagGroup.category });
            if (category) {
                for (const tag of tagGroup.tags) {
                    const tagExists = await Tag.findOne({ name: tag.name, category: category._id });
                    if (!tagExists) {
                        await Tag.create({
                            name: tag.name,
                            slug: createSlug(tag.name),
                            description: tag.description,
                            category: category._id
                        });
                    }
                }
            } else {
                console.error(`❌ Category ${tagGroup.category} not found.`);
            }
        }
        console.log("✅ Tags seeded successfully!");
    } catch (error) {
        console.error("❌ Error seeding tags:", error);
    }
};

export const seedAdminUser = async () => {
    try {
        const adminExists = await User.findOne({ role: 'admin' });

        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('Admin$123', 10);
            const adminUser = new User({
                username: 'Merchant Maritime',
                email: 'admin@merchantmaritime.com',
                password: hashedPassword,
                role: 'admin',
            });

            await adminUser.save();
            console.log('Admin user seeded successfully');
        }
    } catch (error) {
        console.error('Error seeding admin user:', error);
    }
};
