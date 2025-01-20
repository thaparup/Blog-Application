import express from "express";
import { requestBodySize } from "./constants";

const app = express();

app.use(express.json({ limit: requestBodySize }));
app.use(express.urlencoded({ extended: true, limit: requestBodySize }));

// routes

import { router as userRouter } from "./routes/user.routes";

app.use("/api/v1/user", userRouter);

export { app };
