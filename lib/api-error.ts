import { MongoServerError } from "mongodb";
import { ZodError } from "zod";

export enum ErrorCode {
  VALIDATION_ERROR = "VALIDATION_ERROR", // 400
  BAD_REQUEST = "BAD_REQUEST", // 401 / 403
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN", // 404
  NOT_FOUND = "NOT_FOUND", // 409
  CONFLICT = "CONFLICT",
  DUPLICATE_ENTRY = "DUPLICATE_ENTRY", // 422
  UNPROCESSABLE = "UNPROCESSABLE", // 500
  INTERNAL_ERROR = "INTERNAL_ERROR",
  ABORTED = "ABORTED",
  UNKNOWN_ERROR  = "UNKNOWN_ERROR",
  DUPLICATE_KEY  = "DUPLICATE_KEY",
  SCHEMA_VALIDATION_ERROR  = "SCHEMA_VALIDATION_ERROR",
  DB_ERROR  = "DB_ERROR",
}

export interface ApiErrorResponse {
  error: string;
  code: ErrorCode;
  details?: Record<string, unknown>;
}

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;
  public readonly details?: Record<string, unknown>;
  public readonly isOperational: boolean; // false = programmer bug, never expose

  constructor(
    message: string,
    statusCode: number,
    code: ErrorCode,
    details?: Record<string, unknown>,
    isOperational = true,
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;

    // Restore prototype chain (required when extending built-ins in TS)
    Object.setPrototypeOf(this, new.target.prototype);

    // Only capture stack in development
    if (process.env.NODE_ENV !== "production") {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON(): ApiErrorResponse {
    return {
      error: this.message,
      code: this.code,
      ...(this.details && { details: this.details }),
    };
  }

  static badRequest(
    message = "Bad request",
    details?: Record<string, unknown>,
  ): ApiError {
    return new ApiError(message, 400, ErrorCode.BAD_REQUEST, details);
  }

  static validationError(
    message = "Validation failed",
    details?: Record<string, unknown>,
  ): ApiError {
    return new ApiError(message, 400, ErrorCode.VALIDATION_ERROR, details);
  }

  static unauthorized(message = "Unauthorized"): ApiError {
    return new ApiError(message, 401, ErrorCode.UNAUTHORIZED);
  }

  static forbidden(message = "Forbidden"): ApiError {
    return new ApiError(message, 403, ErrorCode.FORBIDDEN);
  }

  static notFound(resource: string): ApiError {
    return new ApiError(`${resource} not found`, 404, ErrorCode.NOT_FOUND);
  }

  static conflict(
    message: string,
    details?: Record<string, unknown>,
  ): ApiError {
    return new ApiError(message, 409, ErrorCode.CONFLICT, details);
  }

  static duplicate(resource: string, field?: string): ApiError {
    return new ApiError(
      `${resource} already exists`,
      409,
      ErrorCode.DUPLICATE_ENTRY,
      field ? { field } : undefined,
    );
  }

  static internal(message = "Internal server error"): ApiError {
    return new ApiError(
      message,
      500,
      ErrorCode.INTERNAL_ERROR,
      undefined,
      false,
    );
  }

  /**
   * Normalizes any thrown/caught value into an ApiError.
   * Safe to call on values from `catch (err) { ... }` where err is `unknown`.
   */
  static fromUnknown(err: unknown): ApiError {
    // Already an ApiError — pass through unchanged
    if (err instanceof ApiError) {
      return err;
    }

    // MongoDB driver errors — map common codes to sensible HTTP statuses
    if (err instanceof MongoServerError) {
      return ApiError.fromMongoError(err);
    }

    // Zod validation errors
    if (err instanceof ZodError) {
      return new ApiError(
        "Validation failed",
        400,
        ErrorCode.VALIDATION_ERROR,
        err.flatten(),
      );
    }

    // AbortError from fetch/cursor cancellation — not really a failure
    if (err instanceof Error && err.name === "AbortError") {
      return new ApiError("Request aborted", 499, ErrorCode.ABORTED);
    }

    // Standard JS Error
    if (err instanceof Error) {
      return new ApiError(err.message, 500, ErrorCode.INTERNAL_ERROR);
    }

    // Thrown string
    if (typeof err === "string") {
      return new ApiError(err, 500, ErrorCode.INTERNAL_ERROR);
    }

    // Anything else (objects, null, undefined, numbers...) — last resort
    return new ApiError(
      "An unexpected error occurred",
      500,
      ErrorCode.UNKNOWN_ERROR
    );
  }

  /** Maps known MongoDB server error codes to appropriate ApiErrors */
  private static fromMongoError(err: MongoServerError): ApiError {
    switch (err.code) {
      case 11000: // duplicate key
        return new ApiError(
          "A record with this value already exists",
          409,
          ErrorCode.DUPLICATE_KEY,
          err.keyValue,
        );
      case 121: // document validation failure
        return new ApiError(
          "Document failed schema validation",
          400,
          ErrorCode.SCHEMA_VALIDATION_ERROR,
        );
      default:
        return new ApiError("Database error occurred", 500, ErrorCode.DB_ERROR);
    }
  }
}

