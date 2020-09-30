function errorHandler(error, req, res, next) {
  const err = {
    Type: error.type || "Unexpected",
    Message: error.message,
    Code: error.status,
    Expect: error.expect
  };
  console.log({ err });
  res.status(error.status || 500).json({
    err
  });
}
module.exports.errorHandler = errorHandler;
