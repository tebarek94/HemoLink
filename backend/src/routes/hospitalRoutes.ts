import { Router } from "express";
import * as hospitalController from "../controllers/hospitalController.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";

export const hospitalRouter = Router();

hospitalRouter.use(requireAdmin);
hospitalRouter.post("/", hospitalController.postHospital);
hospitalRouter.get("/", hospitalController.getHospitals);
