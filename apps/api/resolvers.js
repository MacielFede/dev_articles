const db = require("./db");
const cache = new LRUCache(20);
const { Worker } = require("worker_threads");

function runSearchWorker(data) {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./searchWorker.js");

    worker.postMessage(data);

    worker.on("message", resolve);
    worker.on("error", reject);
  });
}

async function articles({ search }) {
  const cached = cache.get(search);
  if (cached) return cached;

  const results = db.searchArticles(search);
  const ranked = await runSearchWorker(results);

  cache.set(search, ranked);

  return ranked;
}

module.exports = {
  articles,

  article: ({ id }) => {
    return db.getArticle(id);
  },
};
