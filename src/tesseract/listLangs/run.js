const spawn = require("./spawn");
const parse = require("./parse");

const run = callback =>
  spawn((err, data) => {
    callback(err, {
      ...data,
      langs: data.stdout ? parse(data.stdout) : null
    });
  });

module.exports = run;
