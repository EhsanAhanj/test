const mongoose = require("mongoose");

function validateObjectId(req, res, next) {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error("Not Acceptable Object Id");
    err.type = "Custom mongoose object ID validator ";
    err.status = 406;
    next(err);
  } else {
    next();
  }
}
module.exports.validateObjectId = validateObjectId;
