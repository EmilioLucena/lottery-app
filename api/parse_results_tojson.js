"use strict";

const fs = require("fs");
const HTMLParser = require("node-html-parser");
const iconv = require("iconv-lite");
const htmlFilePath = "C:/users/55819/temp/d_mega.htm";
const jsonFilePath =
  "C:/users/55819/Documents/node/my-lotteries-api/resultados.json";

var json = {
  draws: [],
};
var tbRows = [];

const doParse = () => {
  fs.readFile(htmlFilePath, "binary", (err, data) => {
    if (err) {
      console.log("Read error: " + err.code);
    } else {
      const root = HTMLParser.parse(iconv.decode(data, "utf8"));
      tbRows = root.querySelectorAll("tr");
      processRows();
      fs.writeFile(jsonFilePath, JSON.stringify(json), (err) => {
        if (err) {
          console.log("Write File error: " + err.code);
        } else {
          console.log("File created");
        }
      });
    }
  });
};

const processRows = () => {
  let cities = [];
  let index = 1;
  let newElement;
  while (index < tbRows.length) {
    // while (index < 4) {
    const tds = tbRows[index].querySelectorAll("td");
    const parts = tds[1].innerHTML.split("/");
    let tens = [];
    for (let i = 2; i < 8; i++) {
      tens.push(Number(tds[i].innerHTML));
    }
    newElement = {
      draw: Number(tds[0].innerHTML),
      numbers: tens.sort((a, b) => a - b),
      date: new Date(Number(parts[2]), Number(parts[1] - 1), Number(parts[0])),
      winners6: [],
      winners5Count: Number(tds[13].innerHTML),
      fivePrize: Number(toNumberString(tds[14].innerHTML)),
      winners4Count: Number(tds[15].innerHTML),
      fourPrize: Number(toNumberString(tds[16].innerHTML)),
      nextEstimate: Number(toNumberString(tds[19].innerHTML)),
    };

    const winners6 = Number(tds[9].innerHTML);
    newElement.winners6Count = winners6;

    if (winners6 > 0) {
      // somebody won 6 tens
      newElement.winners6.push({
        city: tds[10].innerHTML.trim().replace("\n", "").trim(),
        state: tds[11].innerHTML.trim().replace("\n", "").trim(),
      });
      if (winners6 > 1) {
        // more than one
        if (
          newElement.draw === 139 ||
          newElement.draw === 163 ||
          newElement.draw === 165 ||
          newElement.draw === 200
        ) {
          // exception draw
          newElement.winners6.push({
            city: tds[10].innerHTML.trim().replace("\n", "").trim(),
            state: tds[11].innerHTML.trim().replace("\n", "").trim(),
          });
        } else {
          // no exception draw
          let wtds;
          for (let j = 0; j < winners6 - 1; j++) {
            index++;
            wtds = tbRows[index].querySelectorAll("td");
            newElement.winners6.push({
              city: wtds[0].innerHTML.trim().replace("\n", "").trim(),
              state: wtds[1].innerHTML.trim().replace("\n", "").trim(),
            });
          }
        }
      }
      const text = toNumberString(tds[12].innerHTML);
      newElement.sixPrize = Number(text);
    } else {
      // no winner of 6 tens
      newElement.sixPrize = 0;
    }
    json.draws.push(newElement);
    index++;
  }
};

const toNumberString = (text) => text.replace(/\./g, "").replace(",", ".");

doParse();
