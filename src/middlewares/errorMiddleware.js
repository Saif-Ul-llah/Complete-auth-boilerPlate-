// Error handling middleware
const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack); // Log error stack to the console (for development)
  
    const statusCode = err.statusCode || 500; // Default to 500 for internal server errors
    const message = err?.message || 'Something went wrong!';
  
    // Send response with error message
   return res.status(statusCode).json({
      success: false,
      message: message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack, // Don't show stack trace in production
    });
  };
  
  module.exports = errorMiddleware;
  