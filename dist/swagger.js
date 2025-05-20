"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerURL = process.env.SWAGGER_URL;
const envPort = process.env.PORT;
const port = parseInt(envPort);
const documentationURL = process.env.NODE_ENV === 'development' ? `http://localhost:${port}` : swaggerURL;
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Memevex API Documentation",
            version: "1.0.0",
            description: "MemeVex provides an all-in-one platform for minting memecoins and integrating advanced blockchain metadata. We enable users to easily launch and manage their own tokens, while also offering valuable insights through our dedicated blog. Stay informed with the latest trends, news, and updates in the world of cryptocurrency and blockchain, and join our community of crypto innovators. Whether you're a beginner or an expert, MemeVex is built to help you succeed in the ever-evolving crypto space.",
        },
        servers: [
            {
                url: documentationURL + "/api"
            },
        ],
    },
    apis: ["./dist/routes/*.js", "./dist/controllers/*.js"],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
const setupSwagger = (app) => {
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
};
exports.setupSwagger = setupSwagger;
//# sourceMappingURL=swagger.js.map