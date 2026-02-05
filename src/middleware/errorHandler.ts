import { Request, Response, NextFunction } from "express";
import { CarrierError } from "../domain/errors/CarrierError";
import { ErrorType } from "../domain/errors/ErrorType";
import { assertNever } from "../infra/utils/defaultCaseWrapper";
import { ZodError } from "zod";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof CarrierError) {
    res.status(mapCarrierErrorToStatus(err.type)).json({
      error: err.type,
      carrier: err.carrier,
      message: err.message,
      retryable: err.retryable,
      details: err.details,
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      error: ErrorType.MALFORMED_RESPONSE,
      message: "Validation failed",
      issues: err.issues, // detailed Zod error info
    });
    return;
  }

  if (err instanceof Error) {
    res.status(500).json({
      error: ErrorType.INTERNAL_ERROR,
      message: err.message,
    });
    return;
  }

  res.status(500).json({
    error: ErrorType.INTERNAL_ERROR,
    message: "Unknown error",
    err,
  });
}

function mapCarrierErrorToStatus(type: ErrorType): number {
  switch (type) {
    case ErrorType.AUTH_FAILED:
      return 401;
    case ErrorType.RATE_LIMITED:
      return 429;
    case ErrorType.NETWORK_ERROR:
      return 504;
    case ErrorType.MALFORMED_RESPONSE:
      return 502;
    default:
      return assertNever(type);
  }
}
