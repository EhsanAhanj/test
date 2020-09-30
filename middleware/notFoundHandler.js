function notFoundHandler(req, res, next) {
  const error = new Error("Not Found!");
  error.type = "Custom not found handler";
  error.status = 404;
  next(error);
}
module.exports.notFoundHandler = notFoundHandler;
