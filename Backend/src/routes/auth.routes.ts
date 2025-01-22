import { Router } from "express";
import { googleSignin, signIn } from "../controllers/auth.controller";

const router = Router();

router.route("/signin").post(signIn);
router.route("/google/signin").post(googleSignin);

export { router };
