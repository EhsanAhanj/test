const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// import objects
const { Discount } = require("../model/Discount");
const { Category } = require("../model/Category");
// import middlewares
const { emptyCheckBody } = require("../middleware/emptyCheckBody");
const { upload } = require("../middleware/uploader");
const { validateObjectId } = require("../middleware/validateObjectId");
//import scripts
const { error } = require("../scripts/error");
//set mongodb option
const mongodbOption = { new: true };

router.get("/", async (req, res) => {
  res.status(200).send("Panel is Here !!");
});

module.exports = router;
