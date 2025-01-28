import { Router } from "express";
import {
  demo,
  registerUser,
  tryUser,
  updateUser,
} from "../controllers/user.controller";
import { uploadImage } from "../middleware/file.middleware";
import { verifyJwt } from "../middleware/auth.middleware";

const router = Router();

router
  .route("/register")
  .post(uploadImage().single("profilePicture"), registerUser);
router
  .route("/update/:userId")
  .patch(verifyJwt, uploadImage().single("profilePictureFile"), updateUser);

router.route("/try").post(uploadImage().single("profilePicture"), tryUser);
router.route("/demo").post(uploadImage().single("profile"), demo);

export { router };
