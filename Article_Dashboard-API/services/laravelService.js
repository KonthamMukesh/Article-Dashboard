const axios = require('axios');

// remove trailing slash if any (safety)
const BASE_URL = process.env.LARAVEL_API.replace(/\/$/, '');

exports.getLatestArticle = async () => {
  console.log("Calling:", `${BASE_URL}/articles/latest`);
  const res = await axios.get(`${BASE_URL}/articles/latest`);
  return res.data;
};

exports.createArticle = async (article) => {
  console.log("Posting to:", `${BASE_URL}/articles`);
  return axios.post(`${BASE_URL}/articles`, article);
};

exports.getArticleById = async (id) => {
  console.log(`Calling: ${BASE_URL}/articles/${id}`);
  const res = await axios.get(`${BASE_URL}/articles/${id}`);
  return res.data;
};
exports.findAIByParent = async (parentId) => {
  const res = await axios.get(
    `${BASE_URL}/articles?parent_article_id=${parentId}&type=ai`
  );
  return res.data.data?.length > 0 ? res.data.data[0] : null;
};
