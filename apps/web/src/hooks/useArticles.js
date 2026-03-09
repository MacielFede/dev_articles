import { useState, useEffect } from "react";
import { request, gql } from "graphql-request";

const endpoint = "http://localhost:4000/graphql";

export function useArticles(search) {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const query = gql`
      query Articles($search: String) {
        articles(search: $search) {
          id
          title
          content
        }
      }
    `;

    request(endpoint, query, { search: search || "" }).then((data) =>
      setArticles(data.articles)
    );
  }, [search]);

  return articles;
}
