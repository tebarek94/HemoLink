import type { Request, Response, NextFunction } from "express";
import { createDonorSchema } from "../utils/validation.js";
import * as donorService from "../services/donorService.js";

export async function postDonor(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = createDonorSchema.parse(req.body);
    const donor = await donorService.createDonor(data);
    res.status(201).json(donor);
  } catch (e) {
    next(e);
  }
}

export async function getDonors(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const donors = await donorService.listDonors(search);
    res.json(donors);
  } catch (e) {
    next(e);
  }
}
