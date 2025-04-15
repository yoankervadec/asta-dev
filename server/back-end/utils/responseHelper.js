//
// server/back-end/utils/responseHelper.js

// Success response helper
export const sendSuccessResponse = (res, statusCode, data, isAuthenticated) => {
  res.status(statusCode).json({
    authentification: isAuthenticated ? true : false,
    status: statusCode,
    data,
  });
};

// Error response helper
export const sendErrorResponse = (
  res,
  statusCode,
  message,
  errorDetails,
  isAuthenticated,
  stackTrace = null
) => {
  console.error(
    `[${new Date().toISOString()}] ERROR: ${res?.req?.method} ${
      res?.req?.originalUrl
    }`,
    {
      user: res.req.session?.userId || "Undefined",
      status: statusCode,
      message,
      errorDetails,
      stack: stackTrace || "No stack trace"
    }
  );
  res.status(statusCode).json({
    authentification: isAuthenticated ? true : false,
    status: statusCode,
    message,
    error: errorDetails,
  });
};
