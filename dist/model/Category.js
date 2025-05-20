"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxlength: 50,
    },
    description: {
        type: String,
        maxlength: 150,
        default: '',
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Category", CategorySchema);
//# sourceMappingURL=Category.js.map