const spawn = require("./spawn");
const { Hocr: SpawnBuffer } = require("node-hocr");
const blStreams = require("./blStreams");
const Async = require("async");

const spawnBuffer = (options = {}, configFiles = [], callback) => {
  const proc = spawn(options, configFiles);

  blStreams(
    {
      stderr: proc.stderr,
      stdout: proc.stdout
    },
    callback
  );

  return proc;
};

module.exports = spawnBuffer;
