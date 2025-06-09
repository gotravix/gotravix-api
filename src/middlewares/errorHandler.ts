import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      ok: false,
      message: "❌ Invalid JSON format in request body",
    });
  }
  if (err instanceof ZodError) {
    // Si hay un solo error, muestra solo ese mensaje
    if (err.errors.length === 1) {
      return res.status(400).json({
        ok: false,
        message: err.errors[0].message,
      });
    }
    // Si hay varios errores, puedes concatenar los mensajes o devolver el primero
    return res.status(400).json({
      ok: false,
      message: err.errors.map(e => e.message).join("; ")
    });
  }
  // Otros errores no controlados
  return res.status(500).json({
    ok: false,
    message: "💥 Unexpected server error",
  });
};
