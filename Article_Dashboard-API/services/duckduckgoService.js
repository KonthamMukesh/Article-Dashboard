const puppeteer = require('puppeteer');

exports.search = async (query) => {
  const browser = await puppeteer.launch({
    headless: false, // helps debugging & avoids blocks
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  await page.goto(
    `https://duckduckgo.com/?q=${encodeURIComponent(query)}&ia=web`,
    { waitUntil: 'domcontentloaded' }
  );

  // ⏳ wait a bit for results to render
  await new Promise(resolve => setTimeout(resolve, 3000));

  const links = await page.evaluate(() => {
    const results = [];

    // DuckDuckGo now uses multiple result link patterns
    const anchors = document.querySelectorAll('a');

    for (const a of anchors) {
      const href = a.href;

      if (
        href &&
        href.startsWith('http') &&
        !href.includes('duckduckgo.com') &&
        !href.includes('google.com')
      ) {
        results.push(href);
      }

      if (results.length === 2) break;
    }

    return results;
  });

  console.log('DuckDuckGo links:', links);

  await browser.close();
  return links;
};
