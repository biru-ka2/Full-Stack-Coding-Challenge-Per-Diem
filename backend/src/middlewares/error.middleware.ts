import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import type { ApiErrorResponse } from "../types";

export const notFoundHandler = (req: Request, res: Response): void => {
  const body: ApiErrorResponse = { error: `Route ${req.originalUrl} not found` };
  res.status(404).json(body);
};

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    const body: ApiErrorResponse = { error: err.message };
    res.status(err.statusCode).json(body);
    return;
  }

  // Unknown error — don't leak internals
  console.error("[unhandled error]", err);
  const body: ApiErrorResponse = { error: "An unexpected error occurred" };
  res.status(500).json(body);
};
