"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Please add a name field'],
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'Please add a email field'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please add a password field'],
    },
    profilePicture: {
        type: String,
        default: '',
    },
    role: {
        type: String,
        enum: ['admin', 'editor', 'reader'],
        default: 'reader',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });
UserSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});
exports.default = mongoose_1.default.model('User', UserSchema);
//# sourceMappingURL=User.js.map