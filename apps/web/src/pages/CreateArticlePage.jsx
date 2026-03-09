import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateArticle } from "../hooks/useCreateArticle.js";

function CreateArticlePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { createArticle, loading, error } = useCreateArticle();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      await createArticle({ title: title.trim(), content: content.trim() });
      setTitle("");
      setContent("");
      navigate("/");
    } catch {
      // error is displayed below
    }
  }

  return (
    <div className="page">
      <h1>Create Article</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label className="form-label">
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter article title"
          />
        </label>
        <label className="form-label">
          Content
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your article content..."
            rows={8}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Article"}
        </button>
        {error && (
          <p className="error-text">Error creating article. Please try again.</p>
        )}
      </form>
    </div>
  );
}

export default CreateArticlePage;

