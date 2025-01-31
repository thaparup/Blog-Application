import { Router } from "express";
import {
  createPost,
  deletePost,
  getPosts,
} from "../controllers/post.controller";
import { uploadImage } from "../middleware/file.middleware";
import { verifyJwt } from "../middleware/auth.middleware";

const router = Router();

router
  .route("/create")
  .post(verifyJwt, uploadImage().single("postImageFile"), createPost);

router.route("/getposts").get(getPosts);
router.route("/deletepost/:postId/:userId").delete(verifyJwt, deletePost);
export { router };
