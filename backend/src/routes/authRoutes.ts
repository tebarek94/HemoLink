import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";

export const authRouter = Router();

authRouter.post("/login", authController.postLogin);
authRouter.post("/register", authController.postRegister);
authRouter.get("/me", authController.getMe);
authRouter.patch("/profile", requireAdmin, authController.patchProfile);
