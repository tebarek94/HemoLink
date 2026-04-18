import { Router } from "express";
import * as requestController from "../controllers/requestController.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";

export const requestRouter = Router();

requestRouter.use(requireAdmin);
requestRouter.post("/", requestController.postRequest);
requestRouter.get("/", requestController.getRequests);
