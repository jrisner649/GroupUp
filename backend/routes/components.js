const path = require("path");
const router = require("express").Router();
const componentsPath = path.join(__dirname, "..", "..", "frontend", "components");

router.get("/:name", (req, res) => {
  res.sendFile(path.join(componentsPath, `${req.params.name}.html`));
});

module.exports = router;
