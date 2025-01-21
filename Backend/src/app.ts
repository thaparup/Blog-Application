import express from "express";
import { requestBodySize } from "./constants";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json({ limit: requestBodySize }));
app.use(express.urlencoded({ extended: true, limit: requestBodySize }));
app.use(cookieParser());

// routes

import { router as userRouter } from "./routes/user.routes";
import { router as authRouter } from "./routes/auth.routes";

// user
app.use("/api/v1/user", userRouter);

//auth
app.use("/api/v1/auth", authRouter);

export { app };
