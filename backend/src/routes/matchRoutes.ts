import { Router } from "express";
import * as matchController from "../controllers/matchController.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";

export const matchRouter = Router();

matchRouter.use(requireAdmin);
matchRouter.post("/", matchController.postMatch);
