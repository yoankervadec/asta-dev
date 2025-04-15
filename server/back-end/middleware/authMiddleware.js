// 
// server/back-end/middleware/authMiddleware.js

export const isAuthenticated = (req, res, next) => {
  const user_id = req.session.userId;
  if (user_id) {
    // User is authenticated, proceed to the next middleware/route handler
    next();
  } else {
    // User is not authenticated, send an error response
    res.status(401).json({
      authentication: false,
      status: 401,
      message: "Unauthorized access",
    });
  }
};