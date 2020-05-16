const spawn = require("./spawn");
const blStreams = require("./blStreams");
const debug = require("../../debug")(__filename);

const spawnBuffered = (args, callback) => {
  debug("start", { args });
  const proc = spawn(args);

  let outputErr = null,
    outputData = null;
  blStreams(
    {
      stderr: proc.stderr,
      stdout: proc.stdout
    },
    (err, data) => {
      debug("streams buffered", {
        err: err,
        stdoutLength: data.stdout.length,
        stderrLength: data.stderr.length
      });
      outputErr = err;
      outputData = data;
    }
  );

  proc.once("exit", (code, signal) => {
    const exit = {
      code,
      signal
    };
    debug("process exit", exit);
    callback(outputErr, {
      ...outputData,
      exit: exit
    });
  });

  return proc;
};

module.exports = spawnBuffered;
