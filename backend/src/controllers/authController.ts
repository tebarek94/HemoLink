import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import * as authService from "../services/authService.js";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  registerSecret: z.string().optional(),
});

const patchProfileSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    email: z.string().email().optional(),
    newPassword: z.string().optional(),
    displayName: z.union([z.string().max(120), z.null()]).optional(),
  })
  .refine(
    (data) => {
      const pw = data.newPassword !== undefined && data.newPassword.length > 0;
      return !pw || (data.newPassword?.length ?? 0) >= 8;
    },
    { message: "New password must be at least 8 characters", path: ["newPassword"] }
  )
  .refine(
    (data) => {
      const pw = data.newPassword !== undefined && data.newPassword.length > 0;
      return (
        data.email !== undefined ||
        pw ||
        data.displayName !== undefined
      );
    },
    { message: "Provide a new email, password, and/or display name" }
  );

export async function postLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = loginSchema.parse(req.body);
    const result = await authService.loginAdmin(body.email, body.password);
    res.json(result);
  } catch (e) {
    next(e);
  }
}

export async function postRegister(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = registerSchema.parse(req.body);
    const result = await authService.registerAdmin(
      body.email,
      body.password,
      body.registerSecret?.trim() || undefined
    );
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
}

export async function patchProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.admin?.id;
    if (!adminId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const body = patchProfileSchema.parse(req.body);
    const result = await authService.updateAdminProfile(adminId, {
      currentPassword: body.currentPassword,
      email: body.email,
      newPassword:
        body.newPassword !== undefined && body.newPassword.length > 0 ? body.newPassword : undefined,
      displayName: body.displayName,
    });
    res.json(result);
  } catch (e) {
    next(e);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 16) {
      res.status(500).json({ error: "Server misconfiguration" });
      return;
    }
    const decoded = jwt.verify(token, secret) as { sub: string };
    const admin = await authService.getAdminById(decoded.sub);
    if (!admin) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    res.json({ admin });
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
}
