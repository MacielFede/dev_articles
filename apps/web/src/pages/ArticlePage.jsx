import { Suspense, useEffect, useState } from "react";
import { useSearch } from "../context/SearchContext.jsx";
import { ArticleList } from "../components/ArticleList.jsx";
import { request, gql } from "graphql-request";

const endpoint = "http://localhost:4000/graphql";
const query = gql`
  query Articles($search: String) {
    articles(search: $search) {
      id
      title
      content
    }
  }
`;

function ArticlePage() {
  const { search, setSearch } = useSearch();

  const [promise, setPromise] = useState(
    new Promise(() => Promise.resolve(null))
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPromise(request(endpoint, query, { search: search || "" }));
  }, [search]);

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
      <Suspense fallback={<div>Loading...</div>}>
        <ArticleList fetchArticles={promise} />
      </Suspense>
    </div>
  );
}

export default ArticlePage;
