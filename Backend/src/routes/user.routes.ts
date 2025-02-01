import { Router } from "express";
import {
  deleteUser,
  demo,
  getUser,
  getUsers,
  logoutUser,
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
router.route("/delete/:userId").delete(verifyJwt, deleteUser);
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/getUsers").get(verifyJwt, getUsers);
router.route("/:userId:").get(verifyJwt, getUser);
// *************** demo *********************
router.route("/try").post(uploadImage().single("profilePicture"), tryUser);
router.route("/demo").post(uploadImage().single("profile"), demo);

export { router };
