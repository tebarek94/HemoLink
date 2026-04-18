import type { Request, Response, NextFunction } from "express";
import * as analyticsService from "../services/analyticsService.js";

export async function getAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const counts = await analyticsService.getCounts();
    res.json(counts);
  } catch (e) {
    next(e);
  }
}
