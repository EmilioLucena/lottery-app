const fs = require("fs").promises;

const jsonFilePath =
  "c:/users/55819/documents/node/my-lotteries-api/resultados.json";
const mongoJsonFile =
  "c:/users/55819/documents/node/my-lotteries-api/mongo.json";

var results = [];

const loadResults = async () => {
  const data = await fs.readFile(jsonFilePath, "utf8");
  results = JSON.parse(data).draws;
};

const saveToMongo = async () => {
  await loadResults();
  fs.writeFile(mongoJsonFile, JSON.stringify(results));
  console.log(results.length);
};

saveToMongo();
