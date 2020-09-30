var express = require("express");
const router = express.Router();
var multer = require("multer");
const config = require("config");
const fs = require("fs-extra");
const Joi = require("@hapi/joi");
//import scripts
const { error } = require("../scripts/error");
//---------set upload file name and dynamic destination --
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    let cat = "main";
    if (file.originalname.includes("__")) {
      cat = file.originalname.split("__")[0];
    }
    saveTO = `./uploads/${cat}/${new Date().toISOString().split("T")[0]}`;
    fs.ensureDirSync(saveTO);
    cb(null, saveTO);
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname.replace(/[ ()]/g, ""));
  }
});

// -------set custom filter for storing file -------------
const fileFilter = (req, file, cb) => {
  // if (!Object.keys(req.body)[0]) return next(new Error("Empty Body error dd"));

  // if (req.file == "undefined") return cb(null, false);
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const limits = { fileSize: 1024 * 1024 * 5 };

const upload = multer({
  storage,
  limits,
  fileFilter
});
//----upload images
router.post("/", upload.array("images"), async (req, res, next) => {
  if (!req.files || !req.files[0]) {
    let expect = { images: ["image1", "image2", "image3", "..."] };
    return next(
      error(400, "Custom validation Error", "No file received", expect)
    );
  } else {
    let imagesUrl = [];
    for (img of req.files) {
      const st = `${config.get("domain")}${img.path.replace(/uploads/g, "")}`;
      imagesUrl.push(st);
    }
    console.log("files received");
    return res.send({
      success: true,
      url: imagesUrl
    });
  }
});

//----delete an image-----
router.delete("/", async (req, res, next) => {
  const url = req.query.imageUrl;
  const schema = Joi.string().uri();
  const { error: ex } = Joi.validate(url, schema);
  if (ex) {
    const { message } = ex.details[0];
    return next(error(400, "Joi Validation Error", message));
  }
  const pattern = new RegExp(config.get("domain"));
  const path = url.replace(pattern, "./uploads");
  fs.unlink(path, function(err) {
    if (err)
      return next(
        error(
          500,
          "File Sysyem error",
          "Image cant delete of file path is invalid"
        )
      );
    // if no error, file has been deleted successfully
    res.status(202).send({ sucsess: true, message: "File deleted!" });
  });
});

var cpUpload = upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "gallery", maxCount: 8 }
]);

module.exports = router;
