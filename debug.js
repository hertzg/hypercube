const Debug = require("debug");
const Path = require("path");

const debug = filename => {
  const relative = Path.relative(__dirname, filename).replace(/[\\/]+/g, ":");
  return Debug(`hypercube:${relative}`);
};

module.exports = debug;
