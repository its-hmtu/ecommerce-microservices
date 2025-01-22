import { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import { ApiError, getErrorMessage } from "../utils";
import config from "../config";

export const errorConverter: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || (error instanceof Error ? 400 : 500);
    const message = error.message || (statusCode === 400 ? 'Bad Request' : 'Internal Server Error');
    error = new ApiError(statusCode, message, false, error.stack.toString());
  }
  next(error);
}

export const errorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent || config.env === "development") {
    next(err);
    return
  }

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      message: err.message,
    })
  }

  res.status(err.statusCode || 500).json({
    message: getErrorMessage(err),
  })
}
