const express = require("express");
const router = express.Router();

// else redirext to intro page
router.get("/", async (req, res) => {
  res.status(200).send("OK");
});

router.get("/:username", async (req, res) => {
  const username = req.params.username;
  const result = await Member.findOne({ username });
  if (!result) res.status(404).send("the member with this id was not found");
  res.send(result);
});

module.exports = router;
