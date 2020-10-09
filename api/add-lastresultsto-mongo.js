"use strict";

const fs = require("fs").promises;
const mongoClient = require("mongodb").MongoClient;

const MONGO_URL = "mongodb://127.0.0.1:27017";
const dbName = "caixa_lotteries";
const collection = "mega_draws";

const jsonFilePath =
  "c:/users/55819/documents/node/my-lotteries-api/resultados.json";

var results = [];

const loadResults = async () => {
  const data = await fs.readFile(jsonFilePath, "utf8");
  results = JSON.parse(data).draws;
};

const addLastDraws = async () => {
  try {
    await loadResults();
    const resultsCount = results.length;
    console.log(resultsCount);
    const client = await mongoClient.connect(MONGO_URL, {
      useUnifiedTopology: true,
    });
    const db = client.db(dbName);
    const result = await db
      .collection(collection)
      .find()
      .sort({ draw: -1 })
      .limit(1)
      .toArray();
    const lastDBDraw = result[0].draw;
    if (lastDBDraw == resultsCount) {
      // nothing to add
      client.close();
      console.log("Nothing to add.");
    } else {
      // insert some
      let count = 0;
      for (let i = lastDBDraw; i < resultsCount; i++) {
        let result = await db.collection(collection).insertOne(results[i]);
        count++;
      }
      client.close();
      console.log(`Inserted ${count} new.`);
    }
  } catch (err) {
    console.log(err);
  }
};

//     ,
//     (err, client) => {
//       if (err) throw err;
//       const db = client.db(dbName);
//       const dbCollection = db.collection(collection);
//       dbCollection
//         .find()
//         .sort({ draw: -1 })
//         .limit(1)
//         .toArray((err, result) => {
//           if (err) throw err;
//           const lastDBDraw = result[0].draw;
//           console.log("lastDBDraw = " + lastDBDraw);
//           console.log("lastDraw = " + results[results.length - 1].draw);
//           if (lastDBDraw == results[results.length - 1].draw) {
//             // nothing to add
//             client.close();
//             console.log("Nothing to add.");
//           } else {
//             // we need to add from result[0].draw + 1 onwards...
//             let count = 0;
//             for (let i = lastDBDraw; i < results.length; i++) {
//               console.log(i);
//               dbCollection.insertOne(results[i], (err, res) => {
//                 if (err) throw err;
//                 count++;
//               });
//             }
//             console.log(`Inserted ${count} new records.`);
//             client.close();
//           }
//         });
//     },
//   );
// };

addLastDraws();
