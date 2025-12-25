import axios from "axios";

const API_URL = "laravel_api.railway.internal";
const NODE_URL = "lively-inspiration.railway.internal";

export const fetchArticles = async (page = 1) => {
  const res = await axios.get(`${API_URL}?page=${page}`);
  return res.data;
};

// 🔥 Trigger Phase-2 AI generation (FIXED)
export const runPhase2 = async (articleId) => {
  return axios.post(`${NODE_URL}/run-phase2`, {
    articleId: articleId,
  }); 
};
