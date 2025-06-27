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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const db_1 = require("./config/db");
const ErrorMiddleware_1 = require("./middleware/ErrorMiddleware");
const UserRoute_1 = __importDefault(require("./routes/UserRoute"));
const PostRoute_1 = __importDefault(require("./routes/PostRoute"));
const CategoryRoute_1 = __importDefault(require("./routes/CategoryRoute"));
const TagRoute_1 = __importDefault(require("./routes/TagRoute"));
const CommentRoute_1 = __importDefault(require("./routes/CommentRoute"));
const swagger_1 = require("./swagger");
const SeedData_1 = require("./config/SeedData");
const app = (0, express_1.default)();
const swaggerURL = process.env.SWAGGER_URL;
const envPort = process.env.PORT || '3000';
const port = parseInt(envPort, 10);
// Define allowed CORS origins
const allowedOrigins = [
    'https://cms.merchantnavymaritimeacademy.sch.ng',
    'http://localhost:5173'
];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
// Apply middleware
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api', UserRoute_1.default);
app.use('/api/blog', PostRoute_1.default);
app.use('/api/blog/category', CategoryRoute_1.default);
app.use('/api/blog/tag', TagRoute_1.default);
app.use('/api/blog/comment', CommentRoute_1.default);
(0, swagger_1.setupSwagger)(app);
app.get('/test', (req, res) => {
    res.json({ message: 'CORS test route' });
});
// Error handler middleware
app.use(ErrorMiddleware_1.errorHandler);
// **Ensure database connection before starting the server and seeding data**
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.connectDB)(); // Wait for DB connection to establish
        console.log("✅ Connected to database.");
        console.log("🌱 Starting seed process...");
        yield (0, SeedData_1.seedCategories)();
        yield (0, SeedData_1.seedTags)();
        yield (0, SeedData_1.seedAdminUser)();
        console.log("✅ Seeding completed!");
        // Start server after seeding
        const server = app.listen(port, () => {
            console.log(`🚀 Server running on http://localhost:${port}`);
        });
    }
    catch (error) {
        console.error("❌ Error starting the server:", error);
        process.exit(1);
    }
});
startServer();
exports.default = app;
//# sourceMappingURL=index.js.map