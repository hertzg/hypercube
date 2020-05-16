const express = require("express");
const router = express.Router();
const runOCR = require("../../tesseract/ocr/run");
const multer = require("multer");
const debug = require("../../../debug")(__filename);

const upload = multer({ storage: multer.memoryStorage() });

/* GET users listing. */
router.all("/", upload.any(), function(req, res, next) {
  const options = Object.fromEntries(
    Object.entries(req.query)
      .concat(Object.entries(req.body))
      .filter(([k, v]) => v.length)
      .filter(([k, v]) => v.trim())
  );

  const configFiles = [];
  if (options.configFiles) {
    configFiles.push(
      ...(Array.isArray(options.configFiles)
        ? options.configFiles
        : options.configFiles.split(" "))
    );
    delete options.configFiles;
  }

  const proc = runOCR(options, configFiles, (err, { exit, stdout, stderr }) => {
    res.json({
      configuration: {
        options,
        configFiles
      },
      response: {
        exit,
        stderr: stderr ? stderr.toString("utf8") : null,
        output: exit.code === 0 ? stdout.toString("utf8") : null
      }
    });
  });

  // TODO: Better error handling
  proc.stdin.once("error", err => {
    debug("stdin error", err);
  });
  proc.stdin.end(req.files[0].buffer);
});

module.exports = router;
