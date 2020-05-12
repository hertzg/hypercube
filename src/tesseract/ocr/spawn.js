const spawnBuffered = require("../spawnBuffered");

const spawn = (args, callback) =>
  spawnBuffered(["stdin", "stdout", ...args], callback);

module.exports = spawn;
