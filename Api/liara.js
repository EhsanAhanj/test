const config = require("config");
var Liara = require("@liara/sdk");

var liaraClient = new Liara.Storage.Client({
  accessKey: "OCGL5KAV2VX7P89GIQ52R",
  secretKey: "vOQ1qbf5kid4KoxbzgpKCAmdIWYIXi3doRQIwcnFG",
  endPoint: "5cfb7f84b0fa450017848f78.storage.liara.ir"
});

module.exports.liaraClient = liaraClient;
