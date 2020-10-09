"use strict";

const express = require("express");
const fs = require("fs").promises;
const mongoClient = require("mongodb").MongoClient.promises;

const router = express.Router();
const jsonFilePath = "c:/users/55819/documents/node/my-lotteries-api/resultados.json";

const url = "mongodb://127.0.0.1:27017";
const dbName = "megasena";
const collection = "draws";

var results = [];

router.get("/toptens", async (req, res) => {
  try {
    await loadResults();
    let htmlResult = getRenderTensHTML(results);
    res.status(200).send(htmlResult);
  } catch (err) {
    res.send("erro " + err);
  }
});

router.get("/lastgameresult", async (req, res) => {
  try {
    await loadResults();
    const last = results.length;
    let htmlResult = getTenResultHTML(req.body.tens, last);
    res.status(200).send(htmlResult);
  } catch (err) {
    res.status(500).send("erro " + err.code);
  }
});

router.get("/gameresult/:draw", async (req, res) => {
  try {
    await loadResults();
    const last = results.length;
    let htmlResult = getTenResultHTML(req.body.tens, Number(req.params.draw));
    res.status(200).send(htmlResult);
  } catch (err) {
    res.status(500).send("erro " + err.code);
  }
});

router.get("/toptens6win", async (req, res) => {
  try {
    await loadResults();
    let htmlResult =
      "<h4>Dezenas mais frequentes Nos Sorteios Vencedores da Sena</h4>" +
      getRenderTensHTML(results.filter(({ winners6Count }) => winners6Count));
    res.status(200).send(htmlResult);
  } catch (err) {
    res.send("erro " + err);
  }
});

router.get("/last", async (_, res) => {
  try {
    await loadResults();
    const draw = results[results.length - 1].draw;
    const htmlResults = getResultHTML(draw);
    res.status(200).send(htmlResults);
  } catch (err) {
    res.status(500).send("Some error occurred: " + err.code);
  }
});

// router.get("/last", async (_, res) => {
//   mongoClient.connect(url, (err, client) => {
//     if (err) throw err;
//     const db = client.db(dbName);
//     const options = {
//       sort: { draw: -1 },
//     };
//     db.collection(collection)
//       .find({ numbers: 23 })
//       .sort({ draw: -1 })
//       .toArray((err, res) => {
//         if (err) throw err;
//         console.log(res);
//         client.close();
//       });
//   });

// res.status(200).send("OK");
// });

router.get("/lastten/:ten/:times", async (req, res) => {
  try {
    await loadResults();
    const htmlResults = getLastTenResultsHTML(req.params.ten, req.params.times);
    res.status(200).send(htmlResults);
  } catch (err) {
    res.status(500).send("Some error occurred: " + err.code);
  }
});

router.get("/topstates", async (req, res) => {
  try {
    await loadResults();
    const htmlResults = generateTopStates();
    res.status(200).send(htmlResults);
  } catch (err) {
    res.status(500).send("Some error occurred: " + err.code);
  }
});

router.get("/longeststarv", async (_, res) => {
  try {
    await loadResults();
    const htmlResults = generateLongestStarv();
    res.status(200).send(htmlResults);
  } catch (err) {
    res.status(500).send("Some error occurred: " + err.code);
  }
});

router.get("/draw/:id", async (req, res) => {
  const draw = req.params.id;
  try {
    await loadResults();
    const htmlResults = getResultHTML(Number(draw));
    res.status(200).send(htmlResults);
  } catch (err) {
    res.status(500).send("Some error occurred: " + err.code);
  }
});

router.get("/when/:state", async (req, res) => {
  const state = req.params.state;
  try {
    await loadResults();
    const htmlResults = getStateWinnersDrawsHTML(state.toUpperCase());
    res.status(200).send(htmlResults);
  } catch (err) {
    res.status(500).send("Some error occurred: " + err.message);
  }
});

router.get("/topsix", async (req, res) => {
  try {
    await loadResults();
    const htmlResults = getTopSixPrizesHTML();
    res.status(200).send(htmlResults);
  } catch (err) {
    res.status(500).send("Some error occurred: " + err.message);
  }
});

router.get("/topfive", async (req, res) => {
  try {
    await loadResults();
    const htmlResults = getTopFivePrizesHTML();
    res.status(200).send(htmlResults);
  } catch (err) {
    res.status(500).send("Some error occurred: " + err.message);
  }
});

router.get("/topfour", async (req, res) => {
  try {
    await loadResults();
    const htmlResults = getTopFourPrizesHTML();
    res.status(200).send(htmlResults);
  } catch (err) {
    res.status(500).send("Some error occurred: " + err.message);
  }
});

const loadResults = async () => {
  const data = await fs.readFile(jsonFilePath, "utf8");
  // console.log("loadresults");
  results = JSON.parse(data).draws;
  // console.log(results.length);
};

const getTopSixPrizesHTML = () => {
  const sixDraws = results
    .filter(({ winners6Count }) => winners6Count > 0)
    .sort((a, b) => b.sixPrize - a.sixPrize);

  let html = "<h4>Dez maiores sorteios da Mega</h4>";
  for (let i = 0; i < 10; i++) {
    //prettier-ignore
    html += 
      `<li>${i + 1}o: ${sixDraws[i].draw} 
      Data: ${toBrazilFormat(sixDraws[i].date)} 
      Ganhadores: ${sixDraws[i].winners6Count} 
      Rateio: ${formatCurrency(sixDraws[i].sixPrize)}</li>`;
  }
  return html;
};

const getTopFivePrizesHTML = () => {
  const fiveDraws = results
    .filter(({ winners5Count }) => winners5Count > 0)
    .sort((a, b) => b.fivePrize - a.fivePrize);

  let html = "<h4>Dez maiores sorteios da Mega</h4>";
  for (let i = 0; i < 10; i++) {
    //prettier-ignore
    html += 
      `<li>${i + 1}o: ${fiveDraws[i].draw} 
      Data: ${toBrazilFormat(fiveDraws[i].date)} 
      Ganhadores: ${fiveDraws[i].winners5Count} 
      Rateio: ${formatCurrency(fiveDraws[i].fivePrize)}</li>`;
  }
  return html;
};

const getTopFourPrizesHTML = () => {
  const fourDraws = results
    .filter(({ winners4Count }) => winners4Count > 0)
    .sort((a, b) => b.fourPrize - a.fourPrize);

  let html = "<h4>Dez maiores sorteios da Mega</h4>";
  for (let i = 0; i < 10; i++) {
    //prettier-ignore
    html += 
      `<li>${i + 1}o: ${fourDraws[i].draw} 
      Data: ${toBrazilFormat(fourDraws[i].date)} 
      Ganhadores: ${fourDraws[i].winners4Count} 
      Rateio: ${formatCurrency(fourDraws[i].fourPrize)}</li>`;
  }
  return html;
};

const generateLongestStarv = () => {
  let topNoWinner6Count = 0;
  let noWinner6Count = 0;
  let noWinner6Draw = 1;
  let topNoWinner6Start = 1;
  let topNoWinner6End = 1;
  try {
    results.forEach(({ draw, winners6Count, date }) => {
      if (winners6Count) {
        if (noWinner6Count > topNoWinner6Count) {
          topNoWinner6Count = noWinner6Count;
          topNoWinner6Start = noWinner6Draw;
          topNoWinner6End = draw;
        }
        noWinner6Count = 0;
        noWinner6Draw = draw;
      } else {
        noWinner6Count++;
      }
    });
  } catch (err) {
    console.log(`generateLongestStarv error: ${err.code}`);
  }
  const starvStart = toBrazilFormat(
    results.find(({ draw }) => draw === topNoWinner6Start).date
  );
  const starvEnd = toBrazilFormat(
    results.find(({ draw }) => draw === topNoWinner6End).date
  );
  let html = `<h4>Maior Período sem Vencedores da Sena</h4>
  <li>${topNoWinner6Count} concursos</li>
  <li>Anterior: ${topNoWinner6Start}</li>
  <li>Atual: ${topNoWinner6End}</li>
  <li>Início: ${starvStart}</li>
  <li>Fim: ${starvEnd}`;
  return html;
};

const toBrazilFormat = (date) => {
  const fields = date.substring(0, 10).split("-");
  return `${fields[2]}-${fields[1]}-${fields[0]}`;
};

const generateTopStates = () => {
  let topStates = [];
  try {
    let index;
    results.forEach(({ winners6 }) => {
      winners6.forEach(({ state }) => {
        index = topStates.findIndex(({ name }) => name === state);
        if (index >= 0) {
          topStates[index].wins++;
        } else {
          topStates.push({
            name: state,
            wins: 1,
          });
        }
      });
    });
    topStates.sort((a, b) => b.wins - a.wins);
  } catch (err) {
    console.log(`generateTopStates error: ${err.code}`);
  }
  return getTopStatesHTML(topStates);
};

const generateTensRanking = (draws) => {
  let tenCount = [];
  for (let i = 0; i < 60; i++) {
    let ten = {
      number: i + 1,
      freq: 0,
    };
    tenCount.push(ten);
  }
  draws.forEach(({ numbers }) => {
    let index;
    for (let i = 0; i < 6; i++) {
      index = tenCount.findIndex((ten) => ten.number === numbers[i]);
      tenCount[index].freq++;
    }
  });
  tenCount.sort((a, b) => b.freq - a.freq);
  return tenCount;
};

const getTopStatesHTML = (topStates) => {
  let html = "<h4>Ganhadores por Estado</h4>";
  try {
    topStates.forEach(({ name, wins }) => {
      if (name === "&nbsp") {
        html += `<li>OU : ${wins} ganhadores</li>`;
      } else {
        html += `<li>${name} : ${wins} ganhadores</li>`;
      }
    });
  } catch (err) {
    console.log("getTopStatesHTML error: " + err.code);
  }
  return html;
};

const getRenderTensHTML = (results) => {
  const tenCount = generateTensRanking(results);
  let htmlResult = `<ul>Concursos: ${
    results.length
  }</ul><ul>Média: ${Math.round((results.length * 6) / tenCount.length)}</ul>`;
  for (let i = 0; i < 60; i++) {
    const percent = percentFormat
      .format(tenCount[i].freq / results.length)
      .replace(".", ",");
    htmlResult += `<ul>${i + 1}a - ${
      tenCount[i].number > 9 ? tenCount[i].number : "0" + tenCount[i].number
    } : ${tenCount[i].freq} vezes (${percent})</ul>`;
  }
  return htmlResult;
};

const getResultHTML = (drawNumber) => {
  const draw = results[drawNumber - 1];
  const tenCount = generateTensRanking(results);

  let html = `<ul>Concurso: ${draw.draw}</ul><ul>Data: ${toBrazilFormat(
    draw.date
  )}</ul>`;
  for (let i = 0; i < 6; i++) {
    html += `<ul>${i + 1}a dezena: ${
      draw.numbers[i] > 9 ? draw.numbers[i] : "0" + draw.numbers[i]
    } (${
      tenCount.findIndex((ten) => ten.number === draw.numbers[i]) + 1
    }a)</ul>`;
  }
  if (draw.winners6Count) {
  }
  html += `<ul>Ganhadores Sena: ${draw.winners6Count}</ul>`;
  if (draw.winners6Count) {
    html += `<ul>Rateio: ${formatCurrency(draw.sixPrize)}</ul>`;
    draw.winners6.forEach(({ city, state }) => {
      html += `<ul>&nbsp&nbsp&nbsp&nbsp${city} : ${state}</ul>`;
    });
  }
  html += `<ul>Acumulado próximo: ${formatCurrency(draw.nextEstimate)}</ul>`;

  html += ` 
  <ul>Ganhadores Quina: ${draw.winners5Count}</ul>
  <ul>Rateio: ${formatCurrency(draw.fivePrize)}</ul>
  <ul>Ganhadores Quadra: ${draw.winners4Count}</ul>
  <ul>Rateio: ${formatCurrency(draw.fourPrize)}</ul>`;

  return html;
};

const getStateWinnersDrawsHTML = (state) => {
  let html = `<h4>Concursos com ganhadores do estado ${state}</h4>`;
  try {
    const statesDraws = results.filter(({ winners6 }) =>
      winners6.find((winner) => winner.state === state)
    );
    statesDraws.forEach(({ draw, date, sixPrize }) => {
      //prettier-ignore
      html += 
        `<li>Concurso: ${draw} 
        Data: ${toBrazilFormat(date)} 
        Rateio: ${formatCurrency(sixPrize)}</li>`;
    });
  } catch (err) {
    console.log(`getStateWinnersDrawsHTML error: ${err.code}`);
  }
  return html;
};

const getLastTenResultsHTML = (ten, times) => {
  const withTen = results.filter(({ numbers }) =>
    numbers.includes(Number(ten))
  );
  let html = `<h3>Últimos sorteios com a dezena ${ten}</h3>`;
  const len = withTen.length;
  // console.log(len);

  for (let i = len - 1; i > len - Number(times); i--) {
    html += `<li>Sorteio: ${withTen[i].draw} Data: ${toBrazilFormat(
      withTen[i].date
    )}</li>`;
  }

  return html;
};

const getTenResultHTML = (mytens, draw) => {
  const drawResult = results[draw - 1];
  // console.log(drawResult);
  let matched = [];
  const tens = mytens.split(" ").map((ten) => Number(ten));
  tens.forEach((ten) => {
    if (drawResult.numbers.includes(ten) && !matched.includes(ten)) {
      matched.push(ten);
    }
  });
  let html = `<h4>Concurso: ${drawResult.draw}</h4>
  <ul><li>Dezenas sorteadas: `;
  drawResult.numbers.forEach((ten) => {
    html += `${ten > 9 ? ten : "0" + ten} `;
  });
  html += `</li><li>Acertou: ${matched.length} dezenas</li>`;
  if (matched.length > 0) {
    html += `<li>Dezenas acertadas: `;
    matched
      .sort((a, b) => a - b)
      .forEach((ten) => {
        html += `${ten > 9 ? ten : "0" + ten} `;
      });
    if (matched.length > 3) {
      html += `<li>Parabéns. Ganhou a quadra: ${formatCurrency(
        drawResult.fourPrize
      )}</li>`;
    }
    if (matched.length > 4) {
      html += `<li>Parabéns. Ganhou a quina: ${formatCurrency(
        drawResult.fivePrize
      )}</li>`;
    }
    if (matched.length > 5) {
      html += `<li>Parabéns. Ganhou a megasena: ${formatCurrency(
        drawResult.sixPrize
      )}</li>`;
    }
  }
  html += "</ul>";
  return html;
};

const currencyFormat = Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const percentFormat = Intl.NumberFormat("pt-BR", {
  style: "percent",
  minimumFractionDigits: 2,
});

const formatCurrency = (number) =>
  currencyFormat
    .format(number)
    .replace(".", ":")
    .replace(/,/g, ".")
    .replace(":", ",");

module.exports = router;
