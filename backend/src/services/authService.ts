import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { prisma } from "../prisma/client.js";
import { AppError } from "../utils/errors.js";

function getJwtSecret(): string {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 16) {
    throw new AppError(500, "Server misconfiguration: JWT_SECRET must be at least 16 characters");
  }
  return s;
}

export type AdminPublic = { id: string; email: string; displayName: string | null };

function toPublic(admin: { id: string; email: string; displayName: string | null }): AdminPublic {
  return { id: admin.id, email: admin.email, displayName: admin.displayName };
}

export async function loginAdmin(email: string, password: string): Promise<{ token: string; admin: AdminPublic }> {
  const admin = await prisma.admin.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!admin) {
    throw new AppError(401, "Invalid email or password");
  }
  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) {
    throw new AppError(401, "Invalid email or password");
  }

  const token = issueToken({ id: admin.id, email: admin.email });

  return {
    token,
    admin: toPublic(admin),
  };
}

function issueToken(admin: { id: string; email: string }): string {
  const signOptions: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? "7d") as SignOptions["expiresIn"],
  };
  return jwt.sign({ sub: admin.id, email: admin.email }, getJwtSecret(), signOptions);
}

export async function getAdminById(id: string): Promise<AdminPublic | null> {
  const admin = await prisma.admin.findUnique({
    where: { id },
    select: { id: true, email: true, displayName: true },
  });
  return admin;
}

export async function registerAdmin(
  email: string,
  password: string,
  registerSecret?: string
): Promise<{ token: string; admin: AdminPublic }> {
  const normalized = email.toLowerCase().trim();
  const existing = await prisma.admin.findUnique({ where: { email: normalized } });
  if (existing) {
    throw new AppError(409, "An admin with this email already exists");
  }

  const count = await prisma.admin.count();
  const envSecret = process.env.ADMIN_REGISTER_SECRET?.trim();

  if (count > 0) {
    if (!envSecret) {
      throw new AppError(
        403,
        "Adding admins is disabled until ADMIN_REGISTER_SECRET is set on the server"
      );
    }
    if (!registerSecret || registerSecret !== envSecret) {
      throw new AppError(403, "Invalid registration key");
    }
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await prisma.admin.create({
    data: { email: normalized, passwordHash },
    select: { id: true, email: true, displayName: true },
  });

  const token = issueToken(admin);
  return { token, admin: toPublic(admin) };
}

export async function updateAdminProfile(
  adminId: string,
  input: { currentPassword: string; email?: string; newPassword?: string; displayName?: string | null }
): Promise<{ token: string; admin: AdminPublic }> {
  const admin = await prisma.admin.findUnique({ where: { id: adminId } });
  if (!admin) {
    throw new AppError(404, "Admin not found");
  }

  const currentOk = await bcrypt.compare(input.currentPassword, admin.passwordHash);
  if (!currentOk) {
    throw new AppError(403, "Current password is incorrect");
  }

  const wantsPw = input.newPassword !== undefined && input.newPassword.length > 0;
  const wantsEmail = input.email !== undefined;
  const wantsDisplay = input.displayName !== undefined;
  if (!wantsEmail && !wantsPw && !wantsDisplay) {
    throw new AppError(400, "Change your email, password, and/or display name");
  }

  let nextEmail = admin.email;
  if (input.email !== undefined) {
    const normalized = input.email.toLowerCase().trim();
    if (normalized !== admin.email) {
      const taken = await prisma.admin.findUnique({ where: { email: normalized } });
      if (taken) {
        throw new AppError(409, "That email is already in use");
      }
      nextEmail = normalized;
    }
  }

  let passwordHash = admin.passwordHash;
  if (wantsPw) {
    if (!input.newPassword || input.newPassword.length < 8) {
      throw new AppError(400, "New password must be at least 8 characters");
    }
    passwordHash = await bcrypt.hash(input.newPassword, 12);
  }

  let nextDisplayName = admin.displayName;
  if (wantsDisplay) {
    const t = input.displayName === null ? "" : String(input.displayName).trim();
    nextDisplayName = t.length > 0 ? t : null;
  }

  const updated = await prisma.admin.update({
    where: { id: adminId },
    data: {
      email: nextEmail,
      passwordHash,
      displayName: nextDisplayName,
    },
    select: { id: true, email: true, displayName: true },
  });

  return {
    admin: toPublic(updated),
    token: issueToken(updated),
  };
}
