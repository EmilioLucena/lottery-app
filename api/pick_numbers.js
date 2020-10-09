"use strict";

const axios = require("axios");

const ro_url = "https://api.random.org/json-rpc/2/invoke";

const len = process.argv.len > 1 ? Number(process.argv[2]) : 6;

const ro_json = {
  jsonrpc: "2.0",
  method: "generateIntegerSequences",
  params: {
    apiKey: "8b02c721-fd6c-456e-893f-aac93195a4d8",
    n: 16,
    length: len,
    min: 1,
    max: 60,
    replacement: false,
  },
  id: 2,
};

const pick_numbers = async () => {
  const dayOfMonth = new Date().getDate();
  ro_json.params.n = dayOfMonth;

  try {
    const res = await axios.post(ro_url, ro_json);
    const games = res.data.result.random.data;
    console.log(games[games.length - 1].sort((a, b) => a - b));
    // const json = await res.json();
    // const numbers = res.data.result.random.data.sort((a, b) => a - b);
    // console.log(numbers);
  } catch (err) {
    console.log(err.message);
  }
};

pick_numbers();
