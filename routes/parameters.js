const express = require("express");
const router = express.Router();
const ChildProcess = require("child_process");
const Assert = require("assert");

const stdChunks = (s, next) => {
  const chunks = [];
  s.on("data", chunk => chunks.push(chunk));
  s.once("error", next);
  s.once("end", () => next(null, chunks));
};

const tesseractParams = next => {
  const process = ChildProcess.spawn("tesseract", ["--print-parameters"]);

  stdChunks(process.stdout, (err, chunks) => {
    if (err) {
      return next(err);
    }

    next(
      null,
      Buffer.concat(chunks)
        .toString("utf8")
        .trim()
        .split("\n")
        .filter((v, i) => i > 0)
        .map(l => l.trim())
        .sort()
        .map(l => l.split("\t").map(t => t.trim()))
        .map(([key, defaultValue, description]) => ({
          key,
          defaultValue,
          description
        }))
    );
  });
};

/* GET users listing. */
router.get("/", function(req, res) {
  tesseractParams((err, params) => {
    if (err) {
      return res.json(500, { err });
    }
    res.json({
      find: req.query.find,
      data: req.query.find
        ? params.filter(p =>
            Array.isArray(req.query.find)
              ? req.query.find.includes(p.key)
              : new RegExp(req.query.find).test(p.key)
          )
        : params
    });
  });
});

module.exports = router;
