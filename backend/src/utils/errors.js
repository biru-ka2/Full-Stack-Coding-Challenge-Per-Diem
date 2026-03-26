class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode;
  }
}

class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(message, 404);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

class ValidationError extends AppError {
  constructor(message = "Validation failed") {
    super(message, 422);
  }
}

module.exports = { AppError, NotFoundError, UnauthorizedError, ValidationError };
