// 
// server/back-end/utils/errorHandling/AppError.js

export class AppError extends Error {
  constructor(status, message, title) {
    super(message); // Pass message to the built-in Error class
    this.status = status;
    this.title = title;
    Error.captureStackTrace(this, this.constructor)
  }
}