const parse = buffer =>
  buffer
    .toString("utf8")
    .trim()
    .split("\n")
    .filter((v, i) => i > 0)
    .map(l => l.trim())
    .sort()
    .map(l => l.split("\t").map(t => t.trim()))
    .map(([key, defaultValue, description]) => ({
      key,
      defaultValue,
      description
    }));

module.exports = parse;
