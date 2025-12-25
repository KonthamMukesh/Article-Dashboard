import React, { useEffect, useState } from "react";
import axios from "axios";
import "./GenerateAIModal.css";

const GenerateAIModal = ({ onClose, onSuccess }) => {
  const [type, setType] = useState("");
  const [articles, setArticles] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔄 Load articles when type changes
  useEffect(() => {
    if (!type) {
      setArticles([]);
      setSelectedId("");
      return;
    }

    axios
      .get(`http://127.0.0.1:8000/api/articles?type=${type}`)
      .then(res => setArticles(res.data.data || res.data))
      .catch(err => console.error(err));
  }, [type]);

  const generateAI = async () => {
    if (!type || !selectedId) return;

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:3000/run-phase2", {
        articleId: selectedId,
      });

      if (res.data.success !== false) {
        onSuccess();   // 🔁 refresh dashboard
        onClose();     // ❌ auto close modal
      }
    } catch (err) {
      alert(err.response?.data?.error || "AI generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">

        {/* ===== MODAL TITLE ===== */}
        <h2>Generate AI Article</h2>

        {/* ===== ARTICLE TYPE ===== */}
        <div>
          <label style={{ fontWeight: 600, marginBottom: 6, display: "block" }}>
            Select Article Type
          </label>

          <select
            className="dropdown"
            value={type}
            onChange={e => setType(e.target.value)}
          >
            <option value="">Select article type</option>
            <option value="original">Original Articles</option>
            <option value="ai">AI Generated Articles</option>
          </select>

          {!type && (
            <p className="required-warning">⚠ Please select article type</p>
          )}
        </div>

        {/* ===== ARTICLE LIST ===== */}
        <div>
          <label style={{ fontWeight: 600, marginBottom: 6, display: "block" }}>
            Select Article
          </label>

          <select
            className="dropdown"
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
            disabled={!type}
          >
            <option value="">Select article</option>
            {articles.map(article => (
              <option key={article.id} value={article.id}>
                {article.title}
              </option>
            ))}
          </select>

          {type && !selectedId && (
            <p className="required-warning">⚠ Please select an article</p>
          )}
        </div>

        {/* ===== ACTION BUTTONS ===== */}
        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>

          <button
            onClick={generateAI}
            disabled={!type || !selectedId || loading}
          >
            {loading ? "Generating..." : "Generate AI"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateAIModal;
