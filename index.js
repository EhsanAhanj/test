const express = require("express");
const app = express();
const Joi = require("@hapi/joi");
const helemt = require("helmet");
const Fawn = require("fawn");
const config = require("config");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const homeRoute = require("./routes/home");
const c = require("./routes/c");
const uploadsRoute = require("./routes/uploads");
const adminRoute = require("./routes/admin");
const adminCategoryRoute = require("./routes/admin__c");
const adminDiscountRoute = require("./routes/admin__d");
const adminOwnerRoute = require("./routes/admin__o");
const adminSliderRoute = require("./routes/admin__s");
const { notFoundHandler } = require("./middleware/notFoundHandler");
const { errorHandler } = require("./middleware/errorHandler");

if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR NOT SET ENVARIMENT VAIEBALE");
  process.exit(1);
}

app.use(morgan("dev"));
app.use(helemt());
app.use(cors());
app.use(express.json());
app.use(express.static("uploads"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

app.use("/c", c);
app.use("/admin", adminRoute);
app.use("/admin/d", adminDiscountRoute);
app.use("/admin/c", adminCategoryRoute);
app.use("/admin/o", adminOwnerRoute);
app.use("/admin/s", adminSliderRoute);
app.use("/uploads", uploadsRoute);
app.use("/", homeRoute);

app.use(notFoundHandler);
app.use(errorHandler);
const options = {
  useNewUrlParser: true,
  authSource: "admin",
  useFindAndModify: false
};

mongoose
  .connect("mongodb://" + config.get("db"), options)
  .then(() => console.log("Conectet to Mongodb"))
  .catch(err => console.log(err));

Fawn.init(mongoose);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App lisening on port ${PORT}`);
});
