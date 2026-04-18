import type { Request, Response, NextFunction } from "express";
import { createHospitalSchema } from "../utils/validation.js";
import * as hospitalService from "../services/hospitalService.js";

export async function postHospital(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = createHospitalSchema.parse(req.body);
    const hospital = await hospitalService.createHospital(data);
    res.status(201).json(hospital);
  } catch (e) {
    next(e);
  }
}

export async function getHospitals(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const hospitals = await hospitalService.listHospitals(search);
    res.json(hospitals);
  } catch (e) {
    next(e);
  }
}
