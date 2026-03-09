const { parentPort } = require("worker_threads");

parentPort.on("message", (articles) => {
  const scored = articles.map((a) => ({
    ...a,
    score: Math.random(),
  }));

  scored.sort((a, b) => b.score - a.score);
  parentPort.postMessage(scored);
});

module.exports = runSearchWorker;
