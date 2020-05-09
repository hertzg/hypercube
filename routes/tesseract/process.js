const express = require("express");
const router = express.Router();
const spawnBuffer = require("../../tesseract/spawnBuffer");
const multer = require("multer");
const { BufferListStream } = require("bl");

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

  const proc = spawnBuffer(options, configFiles, (err, { stdout, stderr }) => {
    res.json({
      configuration: {
        options,
        configFiles
      },
      response: {
        err,
        stderr: stderr.toString("utf8"),
        output: stdout.toString("utf8")
      }
    });
  });
  proc.stdin.end(req.files[0].buffer);
});

module.exports = router;
