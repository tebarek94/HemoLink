import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

type JwtPayload = { sub: string; email: string };

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
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
    const decoded = jwt.verify(token, secret) as JwtPayload;
    if (!decoded.sub || !decoded.email) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }
    req.admin = { id: decoded.sub, email: decoded.email };
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
}
