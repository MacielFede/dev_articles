import { Suspense, lazy } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import "./App.css";

const ArticlePage = lazy(() => import("./pages/ArticlePage.jsx"));
const CreateArticlePage = lazy(() => import("./pages/CreateArticlePage.jsx"));

function App() {
  return (
    <div className="app-root">
      <header className="app-header">
        <nav className="nav">
          <NavLink to="/" end className="nav-link">
            Articles
          </NavLink>
          <NavLink to="/create" className="nav-link">
            Create Article
          </NavLink>
        </nav>
      </header>
      <main className="app-main">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<ArticlePage />} />
            <Route path="/create" element={<CreateArticlePage />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;
