// noinspection CommaExpressionJS
Object.fromEntries =
  Object.fromEntries ||
  (arr => arr.reduce((acc, [k, v]) => ((acc[k] = v), acc), {}));

const express = require("express");
const path = require("path");

const app = express();

app.use(express.json({ limit: "20M" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/index"));
app.use("/tesseract/process", require("./routes/tesseract/process"));
app.use("/tesseract/parameters", require("./routes/tesseract/parameters"));
app.use("/tesseract/languages", require("./routes/tesseract/languages"));

module.exports = app;
