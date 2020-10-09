"use strict";

const request = require("request");
const fs = require("fs");
const admZip = require("adm-zip");
const iconv = require("iconv-lite");

const url = "http://www1.caixa.gov.br/loterias/_arquivos/loterias/D_megase.zip";
const destFolder = "c:/users/55819/temp/";
const fileName = "D_megase.zip";
const dest = destFolder + fileName;
const destFileName = "d_mega.htm";
const destHTML = destFolder + destFileName;

const downloadZipFile = async () => {
  try {
    await fs.unlink(dest, async () => {
      await request(url, {
        jar: true,
      }).pipe(fs.createWriteStream(dest));
    });
  } catch (err) {
    console.log("Error downloading file: " + err.messages);
  }
};

const unzip = () => {
  try {
    let zip = new admZip(dest);
    const zipEntries = zip.getEntries();
    zipEntries.forEach(async (zipEntry) => {
      if (zipEntry.entryName == destFileName) {
        fs.writeFile(
          destHTML,
          iconv.decode(zipEntry.getData(), "ISO-8859-1"),
          (err) => {
            if (err) {
              console.log("Write file error: " + err.message);
            }
          },
        );
      }
    });
  } catch (err) {
    console.log("Unzip error: " + err.messages);
  }
};

const doIt = () => {
  const command = process.argv[2];
  if (command === "d") {
    downloadZipFile();
  } else if (command === "u") {
    unzip();
  }
};

doIt();
