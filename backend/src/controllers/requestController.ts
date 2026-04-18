import type { Request, Response, NextFunction } from "express";
import { createRequestSchema } from "../utils/validation.js";
import * as requestService from "../services/requestService.js";

export async function postRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = createRequestSchema.parse(req.body);
    const bloodRequest = await requestService.createRequest(data);
    res.status(201).json(bloodRequest);
  } catch (e) {
    next(e);
  }
}

export async function getRequests(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const requests = await requestService.listRequests(search);
    res.json(requests);
  } catch (e) {
    next(e);
  }
}
