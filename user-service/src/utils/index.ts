import bcrypt from "bcryptjs";

class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(
    statusCode: number,
    message: string | undefined,
    isOperational = true,
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}


function getErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }

  if (err && typeof err === "object" && "message" in err) {
    return String(err["message"]);
  }

  if (typeof err === "string") {
    return err;
  }

  return "An error occurred"; 
}

const encryptPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

const isPasswordMatch = async (password: string, userPassword: string) => {
  return await bcrypt.compare(password, userPassword);
}

export { ApiError, encryptPassword, isPasswordMatch, getErrorMessage };