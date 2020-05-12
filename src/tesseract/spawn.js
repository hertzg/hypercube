const ChildProcess = require("child_process");
const debug = require("../../debug")(__filename);

const spawn = args => {
  debug("spawn tesseract", {args});

  return ChildProcess.spawn("tesseract", args, {
    cwd: process.cwd()
  });
};

module.exports = spawn;
