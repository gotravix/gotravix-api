import { Request, Response, NextFunction } from "express";

export const validateUserForRegister = (req: Request, res: Response, next: NextFunction) => {
  const { password, email } = req.body;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email || typeof email !== "string" || !emailRegex.test(email)) {
    return res.status(400).json({ ok: false, message: "📧 Email not found or invalid" });
  }

  if (
    !password ||
    typeof password !== "string" ||
    password.length < 8 ||
    !/[A-Z]/.test(password) || // At least one uppercase
    !/[a-z]/.test(password) || // At least one lowercase
    !/[0-9]/.test(password) || // At least one number
    !/[\W_]/.test(password) // At least one special character
  ) {
    return res.status(400).json({
      ok: false,
      message:
        "🔒 Password must be at least 8 characters, include an uppercase letter, a lowercase letter, a number, and a special character.",
    });
  }

  next();
};

