import type { Request, Response, NextFunction } from "express";
import { matchSchema } from "../utils/validation.js";
import * as matchService from "../services/matchService.js";

export async function postMatch(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = matchSchema.parse(req.body);
    const result = await matchService.findMatchingDonors(data);
    res.json(result);
  } catch (e) {
    next(e);
  }
}
