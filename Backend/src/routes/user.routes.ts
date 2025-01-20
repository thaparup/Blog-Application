import { Router } from "express";
import { demo, registerUser } from "../controllers/user.controller";
import { uploadImage } from "../middleware/file.middleware";

const router = Router();

router
  .route("/register")
  .post(uploadImage().single("profilePicture"), registerUser);
router.route("/demo").post(uploadImage().single("profile"), demo);

export { router };
