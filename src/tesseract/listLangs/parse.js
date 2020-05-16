const parse = buffer =>
  buffer
    .toString("utf8")
    .trim()
    .split("\n")
    .filter((v, i) => i > 0)
    .map(l => l.trim())
    .sort();

module.exports = parse;
