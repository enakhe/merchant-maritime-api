import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import { connectDB } from './config/db';
import { errorHandler } from './middleware/ErrorMiddleware';
import userRoute from './routes/UserRoute';
import postRoute from './routes/PostRoute';
import categoryRoute from './routes/CategoryRoute';
import tagRoute from './routes/TagRoute';
import commentRoute from './routes/CommentRoute';
import { setupSwagger } from './swagger';
import { seedCategories, seedTags, seedAdminUser } from './config/SeedData';

const app: Application = express();
const swaggerURL = process.env.SWAGGER_URL as string;
const envPort = process.env.PORT || '3000';
const port: number = parseInt(envPort, 10);

// Define allowed CORS origins
const allowedOrigins = [
    'https://cms.merchantnavymaritimeacademy.sch.ng',
    'http://localhost:5173'
];

const corsOptions = {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

// Apply middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', userRoute);
app.use('/api/blog', postRoute);
app.use('/api/blog/category', categoryRoute);
app.use('/api/blog/tag', tagRoute);
app.use('/api/blog/comment', commentRoute);

setupSwagger(app);

app.get('/test', (req: Request, res: Response) => {
    res.json({ message: 'CORS test route' });
});

// Error handler middleware
app.use(errorHandler);

// **Ensure database connection before starting the server and seeding data**
const startServer = async () => {
    try {
        await connectDB(); // Wait for DB connection to establish
        console.log("✅ Connected to database.");

        console.log("🌱 Starting seed process...");
        await seedCategories();
        await seedTags();
        await seedAdminUser();
        console.log("✅ Seeding completed!");

        // Start server after seeding
        const server = app.listen(port, () => {
            console.log(`🚀 Server running on http://localhost:${port}`);
        });

    } catch (error) {
        console.error("❌ Error starting the server:", error);
        process.exit(1);
    }
};

startServer();

export default app;
