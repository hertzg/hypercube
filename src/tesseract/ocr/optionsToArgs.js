const Path = require("path");

const formatKey = s => `-${s.length > 1 ? "-" : ""}${s}`;
const path = (k, v) => Path.resolve(v);
const numeric = (k, v) => v;
const lang = (k, v) => (Array.isArray(v) ? v.join("+") : v);
const variable = (k, v) => `${k}=${v}`;

const OCR_OPTIONS = new Map([
  ["tessdata-dir", { formatKey, formatValue: path }],
  ["user-words", { formatKey, formatValue: path }],
  ["user-patterns", { formatKey, formatValue: path }],
  ["dpi", { formatKey, formatValue: numeric }],
  ["psm", { formatKey, formatValue: numeric }],
  ["oem", { formatKey, formatValue: numeric }],
  ["l", { formatKey, formatValue: lang }]
]);

const optionsToArgs = (options = {}) => {
  return Object.entries(options).flatMap(([k, v]) => {
    if (OCR_OPTIONS.has(k)) {
      const { formatKey, formatValue } = OCR_OPTIONS.get(k);
      return [formatKey(k), formatValue(k, v)];
    } else {
      return [formatKey("c"), variable(k, v)];
    }
  });
};

module.exports = optionsToArgs;
