const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// import objects
const { Slider, validateNewSlider } = require("../model/Slider");
// import middlewares
const { emptyCheckBody } = require("../middleware/emptyCheckBody");
const { upload } = require("../middleware/uploader");
const { validateObjectId } = require("../middleware/validateObjectId");
//import scripts
const { error } = require("../scripts/error");
//set mongodb option
const mongodbOption = { new: true };

//--------- make new slider-------------
router.post("/", emptyCheckBody, async (req, res, next) => {
  const { error: err } = validateNewSlider(req.body);
  if (err) return next(error(400, "Joi Validation Error", err));

  const { percent, title, category, refId, path } = req.body;

  const newSliderImage = new Slider({
    path,
    percent,
    title,
    category,
    refId
  });

  let mongoosErorrs = [];
  let result = {};
  try {
    result = await newSliderImage.save();
  } catch (ex) {
    for (field in ex.errors) {
      mongoosErorrs.push(ex.errors[field].message);
    }
    const error = new Error(mongoosErorrs);
    error.status = 400;
    return next(error);
  }

  res.status(201).send({
    message: `New Image Slider with ${category} category saved to database succesfuly`,
    result
  });
});
//--------get specific discount by id-----------
router.get("/:category", async (req, res, next) => {
  const { category } = req.params;

  const categorySliders = await Slider.find({ category });
  if (!categorySliders[0])
    return next(error(204, "NOT FOUND", "no sliders with this category"));

  res.send({ categorySliders });
});
router.delete("/:id", validateObjectId, async (req, res, next) => {
  const { id } = req.params;

  const Slider = await Slider.findByIdAndRemove(id);
  if (!Slider) next(error(404, "NOT FOUND", "Discount deleted befor"));

  res.send({ status: "ok" });
});

module.exports = router;
