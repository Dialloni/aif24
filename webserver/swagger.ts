// swagger.ts
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            // update title to name of service API
            title: "Project API",
            // update versioning over time
            version: "0.0.1",
            description: "API documentation for Project and ProjectFile models",
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT}`,
                description: "Development server",
            },
            // add live server url here replacing localhost
            {
                url: `http://localhost:${process.env.PORT}`,
                description: "Production server",
            },
        ],
    },
    apis: ["./routes/*.ts"], // Path to the files with API annotations
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default (app: Express) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
