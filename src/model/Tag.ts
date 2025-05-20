import mongoose from 'mongoose';
const { Schema } = mongoose;

const TagSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxlength: 50,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    }
}, { timestamps: true });

export default mongoose.model("Tag", TagSchema)
