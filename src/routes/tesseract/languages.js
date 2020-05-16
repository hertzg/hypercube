const express = require("express");
const router = express.Router();
const runListLangs = require("../../tesseract/listLangs/run");

/* GET users listing. */
router.get("/", function(req, res) {
  runListLangs((err, data) => {
    res.json({
      find: req.query.find,
      data: req.query.find
        ? data.langs.filter(p =>
            Array.isArray(req.query.find)
              ? req.query.find.includes(p.key)
              : new RegExp(req.query.find).test(p.key)
          )
        : data.langs
    });
  });
});

module.exports = router;
