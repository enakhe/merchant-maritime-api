import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application, Express } from "express";

const swaggerURL = process.env.SWAGGER_URL as string;
const envPort = process.env.PORT as string;
const port: number = parseInt(envPort);
const documentationURL = process.env.NODE_ENV === 'development' ? `http://localhost:${port}` : swaggerURL;

const options: swaggerJsDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Memevex API Documentation",
            version: "1.0.0",
            description: "MemeVex provides an all-in-one platform for minting memecoins and integrating advanced blockchain metadata. We enable users to easily launch and manage their own tokens, while also offering valuable insights through our dedicated blog. Stay informed with the latest trends, news, and updates in the world of cryptocurrency and blockchain, and join our community of crypto innovators. Whether you're a beginner or an expert, MemeVex is built to help you succeed in the ever-evolving crypto space.",
        },
        servers: [
            {
                url: documentationURL+"/api"
            },
        ],
    },
    apis: ["./dist/routes/*.js", "./dist/controllers/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);

export const setupSwagger = (app: Application) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
