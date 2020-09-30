function error(status, type, message, expect) {
  const ex = new Error();
  ex.message = message;
  ex.type = type;
  ex.status = status;
  ex.expect = expect;
  return ex;
}
module.exports.error = error;
