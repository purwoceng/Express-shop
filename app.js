import express from "express";
import router from "./app/routes/router.js";
import swagger from "./app/routes/doc-api.js";

const app = express();
app.use(express.json());
app.use(router);
// app.use(swagger);

export default app;
