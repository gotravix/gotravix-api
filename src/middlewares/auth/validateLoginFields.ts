import { Request, Response, NextFunction } from "express";

const validateLoginFields = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      ok: false,
      message: "🔑 Username and password are required",
    });
  }

  next();
};

export default validateLoginFields;
