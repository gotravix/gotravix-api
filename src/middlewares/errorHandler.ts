import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      ok: false,
      message: "❌ Invalid JSON format in request body",
    });
  }
  // Otros errores no controlados
  return res.status(500).json({
    ok: false,
    message: "💥 Unexpected server error",
  });
};
