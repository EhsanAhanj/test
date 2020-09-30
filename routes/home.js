const express = require("express");
const router = express.Router();
const { Owner } = require("../model/Owner");

router.get("/", async (req, res) => {
  res.status(200).send("OK");
});

router.get("/:username", async (req, res, next) => {
  const username = req.params.username;
  const result = await Owner.findOne({ username });
  if (!result) return next();
  res.send(result);
});

module.exports = router;
