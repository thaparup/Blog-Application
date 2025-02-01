import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware";
import {
  createComment,
  getPostComments,
  likeDislikeComment,
} from "../controllers/comment. controller";

const router = Router();

router.route("/create").post(verifyJwt, createComment);
router.route("/getPostComments/:postId").get(getPostComments);
router.route("/likeComment/:commentId").patch(verifyJwt, likeDislikeComment);
export { router };
