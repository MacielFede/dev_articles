import { useState, useEffect } from "react";
import { request, gql } from "graphql-request";

export function useArticles(search) {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const query = gql`
      query {
        articles(search: "${search}") {
          id
          title
        }
      }
    `;

    request("http://localhost:4000/graphql", query).then((data) =>
      setArticles(data.articles)
    );
  }, [search]);

  return articles;
}
