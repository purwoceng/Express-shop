import express from "express";
import swaggerjsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerOptions from "./doc-swagger.js";
import { Router } from "express";

const swagger = express();
const swaggerDocs = swaggerjsdoc(swaggerOptions);
swagger.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

export default swagger;
