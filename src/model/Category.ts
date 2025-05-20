import mongoose from 'mongoose';
const {Schema} = mongoose;

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

export default mongoose.model("Category", CategorySchema)