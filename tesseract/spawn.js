const ChildProcess = require("child_process");
const optionsToArgs = require("./optionsToArgs");

const spawn = (options = {}, configFiles = []) => {
  const args = ["stdin", "stdout", ...optionsToArgs(options), ...configFiles];

  console.log(args);

  return ChildProcess.spawn("tesseract", args, {
    cwd: process.cwd()
  });
};

module.exports = spawn;
