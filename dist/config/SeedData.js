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
exports.seedAdminUser = exports.seedTags = exports.seedCategories = void 0;
const Category_1 = __importDefault(require("../model/Category"));
const Tag_1 = __importDefault(require("../model/Tag"));
const User_1 = __importDefault(require("../model/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const types_1 = require("../types");
const PostService_1 = require("../service/PostService");
const seedCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        for (const category of types_1.CATEGORIES) {
            const categoryExists = yield Category_1.default.findOne({ name: category.name });
            if (!categoryExists) {
                yield Category_1.default.create({
                    name: category.name,
                    description: category.description,
                    slug: (0, PostService_1.createSlug)(category.name)
                });
            }
        }
        console.log("✅ Categories seeded successfully!");
    }
    catch (error) {
        console.error("❌ Error seeding categories:", error);
    }
});
exports.seedCategories = seedCategories;
const seedTags = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        for (const tagGroup of types_1.TAGS) {
            const category = yield Category_1.default.findOne({ name: tagGroup.category });
            if (category) {
                for (const tag of tagGroup.tags) {
                    const tagExists = yield Tag_1.default.findOne({ name: tag.name, category: category._id });
                    if (!tagExists) {
                        yield Tag_1.default.create({
                            name: tag.name,
                            slug: (0, PostService_1.createSlug)(tag.name),
                            description: tag.description,
                            category: category._id
                        });
                    }
                }
            }
            else {
                console.error(`❌ Category ${tagGroup.category} not found.`);
            }
        }
        console.log("✅ Tags seeded successfully!");
    }
    catch (error) {
        console.error("❌ Error seeding tags:", error);
    }
});
exports.seedTags = seedTags;
const seedAdminUser = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminExists = yield User_1.default.findOne({ role: 'admin' });
        if (!adminExists) {
            const hashedPassword = yield bcryptjs_1.default.hash('Admin$123', 10);
            const adminUser = new User_1.default({
                username: 'Merchant Maritime',
                email: 'admin@merchantmaritime.com',
                password: hashedPassword,
                role: 'admin',
            });
            yield adminUser.save();
            console.log('Admin user seeded successfully');
        }
    }
    catch (error) {
        console.error('Error seeding admin user:', error);
    }
});
exports.seedAdminUser = seedAdminUser;
//# sourceMappingURL=SeedData.js.map