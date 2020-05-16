const spawn = require("./spawn");
const optionsToArgs = require("./optionsToArgs");

const run = (options, configFiles, callback) =>
  spawn([...optionsToArgs(options || []), ...(configFiles || [])], callback);

module.exports = run;
