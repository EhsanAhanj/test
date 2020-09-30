const express = require("express");
const router = express.Router();
const _ = require("lodash");
// import objects
const { Category, validateNewCategory, expect } = require("../model/Category");
// import middlewares
const { emptyCheckBody } = require("../middleware/emptyCheckBody");
const { validateObjectId } = require("../middleware/validateObjectId");
//import scripts
const { error } = require("../scripts/error");
//set mongodb option
const mongodbOption = { new: true };

//---GET ALL---
router.get("/", async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).send({ categories });
});
//------------ MAKE NEW CATEGORY-------------
router.post("/", emptyCheckBody, async (req, res, next) => {
  const { error: err } = validateNewCategory(req.body);
  if (err) {
    const { message } = err.details[0];
    return next(error(400, "Joi Validation Error", message, expect));
  }

  const { name_eng, name_fa } = req.body;
  const newCategory = new Category({ name_eng, name_fa });
  try {
    const result = await newCategory.save();
    const newCat = _.pick(result, ["_id", "name_eng", "name_fa"]);
    res.status(201).send({ success: true, newCat });
  } catch (ex) {
    return next(error(500, "Database level error", "Catrgory cant save"));
  }
});
//---UPDATE---
router.put("/:id", validateObjectId, async (req, res, next) => {
  const { id } = req.params;

  const { error: err } = validateNewCategory(req.body);
  if (err) {
    const { message } = err.details[0];
    return next(error(400, "Joi Validation Error", message));
  }

  const { name_eng, name_fa } = req.body;

  try {
    const result = await Category.findByIdAndUpdate(
      id,
      { name_eng, name_fa },
      mongodbOption
    );
    res.status(201).send({ message: "Category Updated Successfully", result });
  } catch (ex) {
    return next(error(500, "Database level error", "Catrgory cant update"));
  }
});
//--DELETE
router.delete("/:id", validateObjectId, async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findByIdAndRemove(id);
  if (!category) return next(error(404, "Maching error", "category not found"));
  res.send({ message: "category deleted succesfuly", category });
});

module.exports = router;
