import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";

import ArticleCard from "./components/ArticleCard";
import GenerateAIModal from "./components/GenerateAIModal";
import ArticleDetail from "./components/Article-Detail/Articledetail";
import "./App.css";

function App() {
  const [articles, setArticles] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);

  /* Pagination */
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);

  /* Keep latest page for auto-refresh */
  const pageRef = useRef(page);

  /* Sync ref with state */
  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  /* Fetch articles */
  const fetchArticles = useCallback(async (pageNumber) => {
    try {
      setLoading(true);

      const res = await axios.get(
        `http://127.0.0.1:8000/api/articles?page=${pageNumber}`
      );

      setArticles(res.data.data);
      setLastPage(res.data.last_page);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  /* Initial load + page change */
  useEffect(() => {
    fetchArticles(page);
  }, [page, fetchArticles]);

  /* Auto refresh every 30s – stays on SAME page */
  useEffect(() => {
    const interval = setInterval(() => {
      fetchArticles(pageRef.current);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [fetchArticles]);

  /* Filters */
  const filteredArticles = articles.filter(article => {
    if (filter === "ai") return article.is_ai_generated;
    if (filter === "original") return !article.is_ai_generated;
    return true;
  });

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="container">
            {/* HEADER */}
            <header className="header">
              <h1>📰 Articles Dashboard</h1>

              <div className="actions">
                <button
                  className={filter === "all" ? "active" : ""}
                  onClick={() => setFilter("all")}
                >
                  All
                </button>

                <button
                  className={filter === "original" ? "active" : ""}
                  onClick={() => setFilter("original")}
                >
                  Original
                </button>

                <button
                  className={filter === "ai" ? "active" : ""}
                  onClick={() => setFilter("ai")}
                >
                  AI Generated
                </button>

                <button
                  className="generate-btn"
                  onClick={() => setShowModal(true)}
                >
                  ➕ Generate AI Article
                </button>
              </div>
            </header>

            {/* ARTICLES */}
            <div className="grid">
              {filteredArticles.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {/* PAGINATION */}
            <div
              style={{
                marginTop: 20,
                display: "flex",
                gap: 12,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <button
                disabled={page === 1 || loading}
                onClick={() => setPage(prev => prev - 1)}
              >
                ◀ Prev
              </button>

              <span>
                Page <strong>{page}</strong> of <strong>{lastPage}</strong>
              </span>

              <button
                disabled={page === lastPage || loading}
                onClick={() => setPage(prev => prev + 1)}
              >
                Next ▶
              </button>
            </div>

            {/* MODAL */}
            {showModal && (
              <GenerateAIModal
                onClose={() => setShowModal(false)}
                onSuccess={() => fetchArticles(page)}
              />
            )}
          </div>
        }
      />

      <Route path="/article/:id" element={<ArticleDetail />} />
    </Routes>
  );
}

export default App;
