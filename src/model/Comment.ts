import mongoose from 'mongoose';
const { Schema } = mongoose;

const CommentSchema = new Schema({
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

export default mongoose.model("Comment", CommentSchema);