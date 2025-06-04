import { Request, Response, NextFunction } from "express";

export const validatePatientFields = (req: Request, res: Response, next: NextFunction) => {
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
    address
  } = req.body;

  if (!userId || typeof userId !== "number") {
    return res.status(400).json({ ok: false, message: "userId is required and must be a number" });
  }
  if (!givenName || typeof givenName !== "string") {
    return res.status(400).json({ ok: false, message: "givenName is required and must be a string" });
  }
  if (!familyName || typeof familyName !== "string") {
    return res.status(400).json({ ok: false, message: "familyName is required and must be a string" });
  }
  if (!birthDate || typeof birthDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
    return res.status(400).json({ ok: false, message: "birthDate is required and must be in YYYY-MM-DD format" });
  }
  if (middleName && typeof middleName !== "string") {
    return res.status(400).json({ ok: false, message: "middleName must be a string if provided" });
  }
  if (phoneNumber && typeof phoneNumber !== "string") {
    return res.status(400).json({ ok: false, message: "phoneNumber must be a string if provided" });
  }
  if (zipCode && typeof zipCode !== "string") {
    return res.status(400).json({ ok: false, message: "zipCode must be a string if provided" });
  }
  if (state && typeof state !== "string") {
    return res.status(400).json({ ok: false, message: "state must be a string if provided" });
  }
  if (city && typeof city !== "string") {
    return res.status(400).json({ ok: false, message: "city must be a string if provided" });
  }
  if (address && typeof address !== "string") {
    return res.status(400).json({ ok: false, message: "address must be a string if provided" });
  }
  next();
};
