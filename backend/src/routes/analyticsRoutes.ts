import { Router } from "express";
import * as analyticsController from "../controllers/analyticsController.js";

export const analyticsRouter = Router();

analyticsRouter.get("/", analyticsController.getAnalytics);
