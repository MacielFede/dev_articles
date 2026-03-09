const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dataDir = path.join(__dirname, "data");
const dbFile = path.join(dataDir, "articles.db");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error("[DB] Failed to open database", err);
  } else {
    console.log("[DB] Connected to SQLite database at", dbFile);
  }
});

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL
    )`
  );
});

function getArticle(id) {
  console.log("[DB] getArticle", { id });
  return new Promise((resolve, reject) => {
    db.get("SELECT id, title, content FROM articles WHERE id = ?", [id], (err, row) => {
      if (err) return reject(err);
      resolve(row || null);
    });
  });
}

function searchArticles(search) {
  console.log("[DB] searchArticles", { search });
  return new Promise((resolve, reject) => {
    const baseQuery = "SELECT id, title, content FROM articles";
    const params = [];
    let whereClause = "";

    if (search && search.trim() !== "") {
      whereClause = " WHERE title LIKE ? OR content LIKE ?";
      const pattern = `%${search.trim()}%`;
      params.push(pattern, pattern);
    }

    db.all(baseQuery + whereClause, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows || []);
    });
  });
}

function createArticle({ title, content }) {
  console.log("[DB] createArticle", { title });
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO articles (title, content) VALUES (?, ?)",
      [title, content],
      function onResult(err) {
        if (err) return reject(err);

        getArticle(this.lastID)
          .then((article) => resolve(article))
          .catch(reject);
      }
    );
  });
}

module.exports = {
  getArticle,
  searchArticles,
  createArticle,
};

