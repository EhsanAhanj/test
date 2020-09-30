const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Fawn = require("fawn");
const Joi = require("@hapi/joi");

// import objects
const { Discount, validateNewDiscount, expect } = require("../model/Discount");
const { Category } = require("../model/Category");
// import middlewares
const { emptyCheckBody } = require("../middleware/emptyCheckBody");
const { upload } = require("../middleware/uploader");
const { validateObjectId } = require("../middleware/validateObjectId");
//import scripts
const { error } = require("../scripts/error");
const { validatePutBody } = require("../validators/put-body-admin-c");
//set mongodb option
const mongodbOption = { new: true };

// router.get("/", async (req, res) => {
//   const discounts = await Discount.find().sort("name");
//   res.status(200).send(discounts);
// });
//--------- make new discount-------------
router.post("/", emptyCheckBody, async (req, res, next) => {
  const { error: err } = validateNewDiscount(req.body);
  if (err) {
    const { message } = err.details[0];
    return next(error(400, "Joi Validation Error", message, expect));
  }
  //----------create new discount -----------------

  const {
    expireDate,
    newPrice,
    realPrice,
    discription,
    category,
    title,
    description,
    owner,
    images
  } = req.body;

  const data = {
    expireDate,
    owner,
    newPrice,
    realPrice,
    discription,
    title,
    images,
    description,
    category
  };

  const newDiscount = new Discount(data);

  try {
    await newDiscount.validate();
  } catch (ex) {
    for (field in ex.errors) {
      let mongoosErorrs = [];
      mongoosErorrs.push(ex.errors[field].message);
      return next(error(400, "Database level error", mongoosErorrs));
    }
  }

  //-------save to database ----------------

  try {
    new Fawn.Task()
      .save(newDiscount)
      .update(
        "owners",
        { _id: newDiscount.owner._id },
        {
          $inc: { activeDiscount: 1 },
          $push: { activeDiscounts: newDiscount._id }
        }
      )
      // .options({ upsert: true })
      .run({ useMongoose: true })
      .then(() => {
        res.status(201).send({ status: "OK", newDiscount });
      });
  } catch (ex) {
    console.log(ex);
  }
});
//--------get specific discount by id-----------
router.get("/:param", async (req, res, next) => {
  const { param } = req.params;
  if (mongoose.Types.ObjectId.isValid(param)) {
    let id = param;
    const discount = await Discount.findById(id);
    if (!discount) return next(error(204, "Not Found", "discount not found"));

    res.status(200).send(discount);
  } else {
    let category = param;
    const cateSearch = await await Discount.find({
      "category.name_eng": category
    });
    console.log(cateSearch);

    if (cateSearch[0]) return res.status(200).send({ ss: "sss", cateSearch });

    res.status(204).send({ message: "no match found" });
  }
});
router.put("/:id", validateObjectId, emptyCheckBody, async (req, res, next) => {
  const { id } = req.params;
  const { error: err } = validatePutBody(req.body);
  if (err) {
    const { message } = err.details[0];
    return next(error(400, "Joi Validation Error", message));
  }
  const updateObject = req.body;
  try {
    const result = await Discount.findByIdAndUpdate(
      id,
      updateObject,
      mongodbOption
    );
    res.status(202).send({
      message: "Owner resource updated successfully",
      result
    });
  } catch (ex) {
    let mongoosErorrs = [];
    for (field in ex.errors) {
      let mongoosErorrs = [];
      mongoosErorrs.push(ex.errors[field].message);
    }
    return next(error(500, "databese level internal", mongoosErorrs));
  }
});
router.delete("/:id", validateObjectId, async (req, res, next) => {
  const { id } = req.params;

  const discount = await Discount.findByIdAndRemove(id);
  if (!discount) return next(new Error("Discount deleted befor"));
  try {
    new Fawn.Task()
      .remove("discounts", { _id: id })
      .update(
        "owners",
        { _id: discount.owner._id },
        {
          $inc: { activeDiscount: -1 },
          $pull: { activeDiscounts: discount._id }
        }
      )
      // .update({ _id: discount.category._id }, { $inc: { count: 1 } })
      .options({ upsert: true })
      .run({ useMongoose: true })
      .then(() => {
        res.status(201).send("Deleted sucssessfuly");
      });
  } catch (ex) {
    console.log(ex);
  }
});
module.exports = router;
