const router = require("express").Router();

router.get("/students", (req, res) => {
  res.json([{ name: "Alice" }, { name: "Bob" }]);
});

module.exports = router;
