const express = require("express");
const router = express.Router();
const spawnBuffer = require("../../tesseract/spawnBuffer");
const Assert = require("assert");
const multer = require("multer");
const { Hocr } = require("node-hocr");

const parseHocr = (buffer, callback) =>
  new Hocr(buffer.toString("utf8"), (err, pages) => {
    pages.map(page => page.map());
  });

const upload = multer({ storage: multer.memoryStorage() });

router.all("/", upload.any(), function(req, res) {
  const options = Object.fromEntries(
    Object.entries(req.query)
      .concat(Object.entries(req.body))
      .filter(([k, v]) => v.length)
      .filter(([k, v]) => v.trim())
  );

  const configFiles = ["hocr"];

  const proc = spawnBuffer(options, configFiles, (err, { stdout, stderr }) => {
    parseHocr(stdout, (err, hocr) => {
      res.json({
        configuration: {
          options,
          configFiles
        },
        response: {
          err,
          stderr: stderr.toString("utf8"),
          output: hocr
        }
      });
    });
  });
  proc.stdin.end(req.files[0].buffer);
});

module.exports = router;
