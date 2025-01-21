import { Router } from "express";
import { signIn } from "../controllers/auth.controller";

const router = Router();

router.route("/signin").post(signIn);

export { router };
