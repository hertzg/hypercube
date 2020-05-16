const express = require("express");
const router = express.Router();
const runPrintParameters = require("../../tesseract/printParameters/run");
const Assert = require("assert");

/* GET users listing. */
router.get("/", function(req, res) {
  runPrintParameters((err, data) => {
    res.json({
      find: req.query.find,
      data: req.query.find
        ? data.parameters.filter(p =>
            Array.isArray(req.query.find)
              ? req.query.find.includes(p.key)
              : new RegExp(req.query.find).test(p.key)
          )
        : data.parameters
    });
  });
});

module.exports = router;
