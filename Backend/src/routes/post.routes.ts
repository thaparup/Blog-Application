import { Router } from "express";
import { createPost } from "../controllers/post.controller";
import { uploadImage } from "../middleware/file.middleware";
import { verifyJwt } from "../middleware/auth.middleware";

const router = Router();

router
  .route("/create")
  .post(verifyJwt, uploadImage().single("postImageFile"), createPost);

export { router };
