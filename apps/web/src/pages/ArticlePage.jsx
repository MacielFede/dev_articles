import { useState } from "react";
import { useSearch } from "../context/SearchContext.jsx";
import { useArticles } from "../hooks/useArticles.js";

function ArticlePage() {
  const { search, setSearch } = useSearch();
  const articles = useArticles(search);
  const [openIds, setOpenIds] = useState(new Set());

  function toggleOpen(id) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className="page">
      <h1>Articles</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <ul className="article-list">
        {articles.map((article) => {
          const isOpen = openIds.has(article.id);
          return (
            <li key={article.id} className="article-item">
              <h2>{article.title}</h2>
              <button
                type="button"
                className="article-toggle"
                onClick={() => toggleOpen(article.id)}
              >
                {isOpen ? "Hide content" : "Show content"}
              </button>
              {isOpen && (
                <div className="article-content">
                  {article.content || <em>No content</em>}
                </div>
              )}
            </li>
          );
        })}
        {articles.length === 0 && (
          <li className="article-empty">No articles found.</li>
        )}
      </ul>
    </div>
  );
}

export default ArticlePage;
