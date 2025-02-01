import { Router } from "express";
import {
  createPost,
  deletePost,
  getPosts,
  updatePost,
} from "../controllers/post.controller";
import { uploadImage } from "../middleware/file.middleware";
import { verifyJwt } from "../middleware/auth.middleware";

const router = Router();

router
  .route("/create")
  .post(verifyJwt, uploadImage().single("postImageFile"), createPost);

router.route("/getposts").get(getPosts);
router.route("/deletepost/:postId/:userId").delete(verifyJwt, deletePost);
router
  .route("/updatepost/:postId/:userId")
  .patch(verifyJwt, uploadImage().single("postImageFile"), updatePost);

export { router };
