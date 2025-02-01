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
import { router as postRouter } from "./routes/post.routes";
import { router as commentRouter } from "./routes/comment.routes";

// user
app.use("/api/v1/user", userRouter);

//auth
app.use("/api/v1/auth", authRouter);

//post
app.use("/api/v1/post", postRouter);

// comment
app.use("/api/ v1/comment", commentRouter);

export { app };
