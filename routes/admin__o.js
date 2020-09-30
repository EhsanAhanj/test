const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const config = require("config");
// import objects
const { Discount } = require("../model/Discount");
const { Category } = require("../model/Category");
const { Owner, validateNewOwner } = require("../model/Owner");
// import middlewares
const { emptyCheckBody } = require("../middleware/emptyCheckBody");
const { upload } = require("../middleware/uploader");
const { validateObjectId } = require("../middleware/validateObjectId");
//import scripts
const { validatePutBody } = require("../validators/put-body-admin-owner");
const { error } = require("../scripts/error");
//set mongodb option
const mongodbOption = { new: true, upsert: true, multi: true };
//-----------add new Owner --------------
router.post("/", emptyCheckBody, async (req, res, next) => {
  const { error: err } = validateNewOwner(req.body);
  if (err) {
    const { message } = err.details[0];
    return next(error(400, "Joi Validation Error", message));
  }

  let {
    userName,
    name,
    phoneNumber,
    ostan,
    city,
    district,
    category,
    address,
    location,
    avatarImage,
    biography
  } = req.body;
  /*

can set defaul valiue here  

  ostan = ostan || "";
  city = city || "";
  location = location || {};
  biography = biography || "x";
  */
  avatarImage = avatarImage || config.get("default-avatar");

  const newOwner = new Owner({
    userName,
    name,
    category,
    address,
    phoneNumber,
    ostan,
    city,
    district,
    location,
    biography,
    avatarLarge: avatarImage,
    avatarSmall: avatarImage
  });

  try {
    let result = await newOwner.save();
    res
      .status(201)
      .send({ message: "New owner saved to database succesfuly", result });
  } catch (ex) {
    for (field in ex.errors) {
      let mongoosErorrs = [];
      mongoosErorrs.push(ex.errors[field].message);
    }
    return next(error(400, "Database level error", mongoosErorrs));
  }
});

//----------get all sellers----------------
router.get("/", async (req, res, next) => {
  const owners = await Owner.find();
  const count = owners.length;
  const pageInfo = {
    first: "15",
    after: "",
    hasNext: false
  };

  res.status(200).send({ count, pageInfo, data: owners });
});

//----------get seller by id----------------
router.get("/:id", validateObjectId, async (req, res, next) => {
  const { id } = req.params;
  const owner = await Owner.findById(id);
  if (!owner) return next(error(404, "Maching error", "owner not found"));
  res.status(200).send({ owner });
});
//--------update owner----------
router.put("/:id", validateObjectId, emptyCheckBody, async (req, res, next) => {
  const { id } = req.params;
  const { error: err } = validatePutBody(req.body);
  if (err) {
    const { message } = err.details[0];
    return next(error(400, "Joi Validation Error", message));
  }
  const updateObject = req.body;
  try {
    const result = await Owner.findByIdAndUpdate(
      id,
      updateObject,
      mongodbOption
    );
    res.status(202).send({
      message: "Owner resource updated successfully",
      result
    });
  } catch (ex) {
    for (field in ex.errors) {
      let mongoosErorrs = [];
      mongoosErorrs.push(ex.errors[field].message);
    }
    return next(error(500, "databese level internal", mongoosErorrs));
  }
});
//---------remove seller-------------
router.delete("/:id", validateObjectId, async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await Owner.findByIdAndRemove(id);
    if (!result) throw new Error("NOT OK");
    res.status(201).send({
      message: "resource removed successfully",
      result
    });
  } catch (ex) {
    return next(error(500, "Not find maybe deleted befor", ex.message));
  }
});

module.exports = router;
