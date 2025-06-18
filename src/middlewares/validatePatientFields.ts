import { Request, Response, NextFunction } from "express";
import { getAllUsers } from "@/repositories/db/userRepository";

export const validatePatientFields = async (req: Request, res: Response, next: NextFunction) => {
  const {
    userId,
    givenName,
    familyName,
    birthDate,
    middleName,
    phoneNumber,
    zipCode,
    state,
    city,
    address,
    username
  } = req.body;

  if (!userId || typeof userId !== "number") {
    return res.status(400).json({ ok: false, message: "userId is required and must be a number" });
  }
  const user = (req as any).user;
  if (userId !== user.id) {
    return res.status(400).json({ ok: false, message: "userId must match the authenticated user id" });
  }

  // Validaciones de username
  if (!username || typeof username !== "string" || !username.trim() || username.length < 3 || username.length > 64) {
    return res.status(400).json({ ok: false, message: "username is required, must be a non-empty string, and between 3 and 64 characters" });
  }
  // Si username es igual al email, debe ser el email del usuario autenticado
  if (username === user.email && user.username !== username) {
    return res.status(400).json({ ok: false, message: "If username is the same as your email, it must belong to you." });
  }
  // Validar que el username sea único (excepto para el propio usuario)
  try {
    const users = await getAllUsers();
    const exists = users.some(u => u.username === username && u.id !== user.id);
    if (exists) {
      return res.status(400).json({ ok: false, message: "Username is already taken by another user" });
    }
  } catch {
    return res.status(500).json({ ok: false, message: "Error validating username uniqueness" });
  }

  // Validaciones de givenName
  if (!givenName || typeof givenName !== "string" || !givenName.trim() || givenName.length > 128) {
    return res.status(400).json({ ok: false, message: "givenName is required, must be a non-empty string, and at most 128 characters" });
  }

  // Validaciones de familyName
  if (!familyName || typeof familyName !== "string" || !familyName.trim() || familyName.length > 128) {
    return res.status(400).json({ ok: false, message: "familyName is required, must be a non-empty string, and at most 128 characters" });
  }

  // Validaciones de middleName
  if (middleName && (typeof middleName !== "string" || !middleName.trim() || middleName.length > 128)) {
    return res.status(400).json({ ok: false, message: "middleName must be a non-empty string of max 128 characters if provided" });
  }

  // Validaciones de birthDate
  if (!birthDate || typeof birthDate !== "string" || !birthDate.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
    return res.status(400).json({ ok: false, message: "birthDate is required and must be in YYYY-MM-DD format" });
  }
  if (birthDate) {
    const birth = new Date(birthDate);
    const now = new Date();
    if (birth > now) {
      return res.status(400).json({ ok: false, message: "birthDate cannot be in the future" });
    }
  }

  // Validaciones de phoneNumber
  if (phoneNumber) {
    if (typeof phoneNumber !== "string" || !phoneNumber.trim() || phoneNumber.length > 32) {
      return res.status(400).json({ ok: false, message: "phoneNumber must be a non-empty string of max 32 characters if provided" });
    }
    if (!/^\+?\d{7,32}$/.test(phoneNumber)) {
      return res.status(400).json({ ok: false, message: "phoneNumber must contain only digits and may start with +" });
    }
  }

  // Validaciones de zipCode
  if (zipCode && (typeof zipCode !== "string" || !zipCode.trim() || zipCode.length > 16 || !/^\d+$/.test(zipCode))) {
    return res.status(400).json({ ok: false, message: "zipCode must be a non-empty string of max 16 digits if provided" });
  }

  // Validaciones de state
  if (state && (typeof state !== "string" || !state.trim() || state.length > 64)) {
    return res.status(400).json({ ok: false, message: "state must be a non-empty string of max 64 characters if provided" });
  }

  // Validaciones de city
  if (city && (typeof city !== "string" || !city.trim() || city.length > 64)) {
    return res.status(400).json({ ok: false, message: "city must be a non-empty string of max 64 characters if provided" });
  }

  // Validaciones de address
  if (address && (typeof address !== "string" || !address.trim() || address.length > 128)) {
    return res.status(400).json({ ok: false, message: "address must be a non-empty string of max 128 characters if provided" });
  }

  next();
};
