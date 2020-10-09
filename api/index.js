"use strict";

const express = require("express");
const app = express();

const apiRouter = require("./results.js");
const port = 8080;

app.use(express.json());
app.use("/results", apiRouter);

app.listen(port, (err) => {
  if (err) {
    console.log("Error: " + err.code);
  } else {
    console.log("API started. Listenning on port " + port);
  }
});
