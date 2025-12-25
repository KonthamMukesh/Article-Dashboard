import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Articledetail.css";

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/articles/${id}`)
      .then(res => setArticle(res.data));
  }, [id]);

  if (!article) return <p>Loading...</p>;

  return (
    <div className="detail-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h1>{article.title}</h1>

      <p className="date">
        {new Date(article.published_at).toLocaleString()}
      </p>

      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {article.references?.length > 0 && (
        <div className="refs">
          <h3>References</h3>
          <ul>
            {article.references.map((ref, i) => (
              <li key={i}>
                <a href={ref} target="_blank" rel="noreferrer">
                  {ref}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ArticleDetail;
