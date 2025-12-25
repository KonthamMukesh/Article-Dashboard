import { useNavigate } from "react-router-dom";
import "./ArticleCard.css";

const ArticleCard = ({ article }) => {
  const navigate = useNavigate();

  return (
    <div className="card">
     <div className="card-header">
  <h3 className="title">{article.title}</h3>

  <span
    className={`badge ${article.is_ai_generated ? "ai" : "original"}`}
  >
    {article.is_ai_generated ? "AI" : "Original"}
  </span>
</div>

      <p className="date">
        {article.published_at
          ? new Date(article.published_at).toLocaleString()
          : "—"}
      </p>

      <p className="preview">
        {article.content.slice(0, 200)}...
      </p>

      <button
        className="read-more"
        onClick={() => navigate(`/article/${article.id}`)}
      >
        Read More →
      </button>
    </div>
  );
};

export default ArticleCard;
