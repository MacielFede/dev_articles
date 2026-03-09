import { useState } from "react";
import { request, gql } from "graphql-request";

const endpoint = "http://localhost:4000/graphql";

export function useCreateArticle() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function createArticle({ title, content }) {
    setLoading(true);
    setError(null);

    const mutation = gql`
      mutation CreateArticle($title: String!, $content: String!) {
        createArticle(title: $title, content: $content) {
          id
          title
          content
        }
      }
    `;

    try {
      const data = await request(endpoint, mutation, { title, content });
      setLoading(false);
      return data.createArticle;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  }

  return { createArticle, loading, error };
}

