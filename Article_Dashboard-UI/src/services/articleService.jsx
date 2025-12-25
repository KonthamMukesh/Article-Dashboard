import axios from "axios";

const API_URL = "laravelapi-production-2fe5.up.railway.app/api/articles";
const NODE_URL = "node-api-production-eb02.up.railway.app";

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
