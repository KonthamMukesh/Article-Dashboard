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
