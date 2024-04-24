import { Router } from "express";
import { registerMajdur } from "../controllers/majdur.controller.js";

const router = Router();

router.route("/register").post(registerMajdur);

export default router;
