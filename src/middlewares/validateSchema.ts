import { BuildSchema } from "drizzle-zod";
import { Request, Response, NextFunction } from "express"
import { ZodType, ZodTypeAny, ZodTypeDef } from "zod";

export function validateSchemaMw<
  T extends "select" | "insert" | "update",
  Q extends Record<string, any>,
  R extends Record<string, any> | undefined,
  P extends true | Partial<Record<"string" | "number" | "bigint" | "boolean" | "date", true>> | undefined
>(
  schema: BuildSchema<T, Q, R, P>,
  property: "body" | "query" | "params"
): (req: Request, res: Response, next: NextFunction) => void;

export function validateSchemaMw<
    Output, 
    Def extends ZodTypeDef, 
    Input = Output,
>(
  schema: ZodType<Input, Def, Input>,
  property: "body" | "query" | "params",
): (req: Request, res: Response, next: NextFunction) => void;

export function validateSchemaMw(
    schema: any, 
    property: 
        | "body" 
        | "query" 
        | "params"
) {
    return (req: Request, res: Response, next: NextFunction) => {
        const parsed = schema.safeParse(req[property]);
        if (parsed.success !== true) {
            throw parsed.error;
        }
        req[property] = parsed.data;
        next();
    }
}

export default validateSchemaMw;