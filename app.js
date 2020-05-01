Object.fromEntries =
  Object.fromEntries ||
  (arr => arr.reduce((acc, [k, v]) => ((acc[k] = v), acc), {}));

const express = require("express");
const path = require("path");

const indexRouter = require("./routes/index");
const processRoute = require("./routes/process");
const parametersRoute = require("./routes/parameters");

const app = express();

app.use(express.json({ limit: "200M" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/tesseract/process", processRoute);
app.use("/tesseract/parameters", parametersRoute);

module.exports = app;
