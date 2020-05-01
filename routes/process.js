const express = require("express");
const router = express.Router();
const ChildProcess = require("child_process");
const multer = require("multer");
const FS = require("fs");
const debug = require("debug")("process");

const run = (options = {}, config = {}, configFiles = []) => {
  const opts = ["stdin", "stdout"];

  if (options.l) {
    opts.push("-l", Array.isArray(options.l) ? options.l.join("+") : options.l);
  }

  if (options.dpi !== undefined) {
    opts.push("--dpi", options.dpi);
  }

  if (options.psm !== undefined) {
    opts.push("--psm", options.psm);
  }

  if (options.oem !== undefined) {
    opts.push("--oem", options.oem);
  }

  if (Object.keys(config).length) {
    opts.push(
      ...Object.entries(config).flatMap(([k, v]) => ["-c", `${k}=${v}`])
    );
  }

  if (configFiles.length) {
    opts.push(...configFiles);
  }

  debug("args", opts);

  return ChildProcess.spawn("tesseract", opts, {
    stdio: ["pipe", "pipe", "inherit"],
    cwd: process.cwd()
  });
};

const stdChunks = (s, next) => {
  const chunks = [];
  s.on("data", chunk => chunks.push(chunk));
  s.once("error", next);
  s.once("end", () => next(null, chunks));
};

const OPTIONS = ["l", "dpi", "psm", "oem"];

const upload = multer({ storage: multer.memoryStorage() });

/* GET users listing. */
router.all("/", upload.any(), function(req, res, next) {
  const configFiles = [];
  let inputs = Object.fromEntries(
    Object.entries(req.query)
      .concat(Object.entries(req.body))
      .filter(([k, v]) => v.length)
      .filter(([k, v]) => v.trim())
  );

  if (inputs.types) {
    configFiles.push(
      ...(Array.isArray(inputs.types) ? inputs.types : inputs.types.split(" "))
    );
    delete inputs.types;
  }

  const options = Object.fromEntries(
    Object.entries(inputs).filter(([k]) => OPTIONS.includes(k))
  );

  const config = Object.fromEntries(
    Object.entries(inputs).filter(([k]) => !OPTIONS.includes(k))
  );

  const process = run(options, config, configFiles);
  process.stdin.end(req.files[0].buffer);

  stdChunks(process.stdout, (err, chunks) => {
    res.json({
      request: {
        options,
        config
      },
      response: {
        output: Buffer.concat(chunks).toString("utf8")
      }
    });
  });
});

module.exports = router;
