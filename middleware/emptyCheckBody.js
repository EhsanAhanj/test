function emptyCheckBody(req, res, next) {
  if (!Object.keys(req.body)[0]) {
    const err = new Error("Payment Required");
    err.type = "Custom validator error";
    err.status = 402;
    next(err);
  } else {
    next();
  }
}
module.exports.emptyCheckBody = emptyCheckBody;
