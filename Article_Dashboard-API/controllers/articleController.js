const laravel = require('../services/laravelService');
const google = require('../services/googleService');
const duckduckgo = require('../services/duckduckgoService');
const scrape = require('../services/scrapeService');
const ollama = require('../services/ollamaService');
const format = require('../utils/referenceFormatter');


exports.processArticle = async (articleId = null) => {
  let article; // ✅ declare outside

  try {
    if (articleId) {
      console.log(`➡ Fetching article by ID: ${articleId}`);
      article = await laravel.getArticleById(articleId);
    } else {
      console.log('➡ Fetching latest article');
      article = await laravel.getLatestArticle();
    }
    const existingAI = await laravel.findAIByParent(article.id);
if (existingAI) {
  return { message: "AI article already exists for this article" };
}

    // ❌ Prevent AI-on-AI (optional safety)
    if (article.is_ai_generated) {
      throw new Error("Cannot generate AI from an AI article");
    }

    console.log(`➡ Searching for: ${article.title}`);
    let links = await google.search(article.title);

    if (!links || links.length < 2) {
      console.log('⚠ Google blocked. Falling back to DuckDuckGo...');
      links = await duckduckgo.search(article.title);
    }

    console.log('➡ Scraping competitor articles...');
    const ref1 = await scrape.scrape(links[0]);
    const ref2 = await scrape.scrape(links[1]);

    console.log('➡ Calling Ollama LLM...');
    let newContent = await ollama.rewriteArticle(
      article.content,
      ref1,
      ref2
    );

    newContent = format.addReferences(newContent, links);

    console.log('➡ Publishing AI-enhanced article...');
    await laravel.createArticle({
      title: article.title + ' (AI Enhanced)',
      content: newContent,
      published_at: new Date().toISOString(),
      is_ai_generated: true,
      parent_article_id: article.id,
      references: links,
    });

    console.log('✅ Phase-2 completed successfully');

    return true; // ✅ IMPORTANT
  } catch (err) {
    console.error('❌ Phase-2 failed:', err.message);
    throw err;
  }
};
