import { Router } from "express";
import * as donorController from "../controllers/donorController.js";

export const donorRouter = Router();

donorRouter.post("/", donorController.postDonor);
donorRouter.get("/", donorController.getDonors);
