const path = require("path");
const { Worker } = require("worker_threads");
const db = require("./db");

class LRUCache {
  constructor(limit = 20) {
    this.limit = limit;
    this.map = new Map();
  }

  get(key) {
    if (!this.map.has(key)) return null;
    const value = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }

  set(key, value) {
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.limit) {
      const firstKey = this.map.keys().next().value;
      this.map.delete(firstKey);
    }
    this.map.set(key, value);
  }

  clear() {
    this.map.clear();
  }
}

const cache = new LRUCache(20);

function runSearchWorker(data) {
  console.log("[Worker] Spawning search worker for", data.length, "articles");
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.join(__dirname, "searchWorker.js"));

    worker.postMessage(data);

    worker.on("message", (result) => {
      console.log("[Worker] Search worker completed with", result.length, "results");
      worker.terminate();
      resolve(result);
    });
    worker.on("error", (err) => {
      console.error("[Worker] Search worker error", err);
      worker.terminate();
      reject(err);
    });
  });
}

async function articles({ search }) {
  console.log("[Resolver] articles called with search:", search);
  const key = search || "";
  const cached = cache.get(key);
  if (cached) return cached;

  const results = await db.searchArticles(search);
  const ranked = await runSearchWorker(results);

  cache.set(key, ranked);

  console.log("[Resolver] articles returning", ranked.length, "articles");
  return ranked;
}

async function article({ id }) {
  console.log("[Resolver] article called with id:", id);
  return db.getArticle(id);
}

async function createArticle({ title, content }) {
  console.log("[Resolver] createArticle called with title:", title);
  const article = await db.createArticle({ title, content });
  cache.clear();
  console.log("[Resolver] createArticle created article with id:", article && article.id);
  return article;
}

module.exports = {
  articles,
  article,
  createArticle,
};
