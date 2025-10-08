
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (err.name === "ValidationError") {
    return res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      status: "fail",
      message: "Invalid ID format",
    });
  }

  res.status(statusCode).json({
    status: "error",
    message,
  });
};

module.exports = errorHandler;
