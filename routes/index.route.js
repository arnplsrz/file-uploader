const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  if (!req.user) return res.redirect("/signin");
  return res.redirect("/folder");
});

module.exports = router;
