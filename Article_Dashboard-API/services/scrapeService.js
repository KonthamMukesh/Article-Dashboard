const axios = require('axios');
const cheerio = require('cheerio');

exports.scrape = async (url) => {
  // 🔒 SAFETY CHECK
  if (!url || !url.startsWith('http')) {
    throw new Error(`Invalid URL passed to scraper: ${url}`);
  }

  console.log('Scraping URL:', url);

  const { data } = await axios.get(url, { timeout: 15000 });
  const $ = cheerio.load(data);

  let text = '';
  $('p').each((_, el) => {
    text += $(el).text() + '\n';
  });

  return text;
};
