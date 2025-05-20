import mongoose from 'mongoose';
import colors from 'colors';

export const connectDB = async () => {
    try {
        const envMonURI = process.env.MONGO_URI as string;
        const connection = process.env.NODE_ENV !== 'development' ? envMonURI : "mongodb://localhost:27017/blog";
        const conn = await mongoose.connect(connection);
        console.log(colors.red.underline(`MongoDB Connected: ${conn.connection.host}`));
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};