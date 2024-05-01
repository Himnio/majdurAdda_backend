import { Router } from "express";
import {registerUser, getCurrentUser,loginUser, updateAccountDetails} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update_account").patch(verifyJWT, updateAccountDetails)

export default router;