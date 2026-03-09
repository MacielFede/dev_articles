import { use, useState } from "react";

export function ArticleList({ fetchArticles }) {
  const data = use(fetchArticles);
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
    <ul className="article-list">
      {data?.articles.map((article) => {
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
      {data?.articles.length === 0 && (
        <li className="article-empty">No articles found.</li>
      )}
    </ul>
  );
}
