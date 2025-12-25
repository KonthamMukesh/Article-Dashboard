const puppeteer = require('puppeteer');

exports.search = async (query) => {
  const browser = await puppeteer.launch({
    headless: false, // 👈 IMPORTANT (disable headless)
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Pretend to be a real Chrome browser
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  await page.goto(
    `https://www.google.com/search?q=${encodeURIComponent(query)}`,
    { waitUntil: 'networkidle2' }
  );

  // Wait a bit more
 await new Promise(resolve => setTimeout(resolve, 3000));

  const links = await page.evaluate(() => {
    const results = [];
    const anchors = document.querySelectorAll('a');

    for (const a of anchors) {
      const href = a.getAttribute('href');

      if (href && href.startsWith('/url?q=')) {
        const url = new URL('https://google.com' + href)
          .searchParams.get('q');

        if (url && url.startsWith('http')) {
          results.push(url);
        }
      }

      if (results.length === 2) break;
    }

    return results;
  });

  await browser.close();
  return links;
};
