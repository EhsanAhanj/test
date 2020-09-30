const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { Discount } = require("../model/Discount");
const { error } = require("../scripts/error");

router.get("/", async (req, res) => {
  const all = await Discount.find();
  const count = all.length;
  const pageInfo = {
    count,
    has_next: false,
    after: ""
  };
  res.status(200).send({ pageInfo, all });
});

router.get("/:category", async (req, res, next) => {
  const category = req.params.category;

  const dis = await Discount.find({ "category.name_eng": category });

  if (!dis[0]) {
    return next(
      error(404, "Not data Find", "NO DISCOUNT WITH THIS CATEGORY FIND")
    );
  }

  const gooz = dis.map(el => _.pick(el, "thumbnail"));
  const count = dis.length;

  const pageInfo = {
    count,
    has_next: false,
    after: ""
  };
  res.status(200).send({ pageInfo, gooz });
});

module.exports = router;
