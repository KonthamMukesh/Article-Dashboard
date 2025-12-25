const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// reduce context for speed
const shorten = (text, limit = 1500) =>
  text && text.length > limit ? text.slice(0, limit) : text;

exports.rewriteArticle = async (original, ref1, ref2) => {
  const prompt = `
Rewrite the original article professionally.

Original Article:
${shorten(original, 2000)}

Reference Article 1:
${shorten(ref1)}

Reference Article 2:
${shorten(ref2)}

Rules:
- Improve formatting and headings
- Do NOT copy text
- Make SEO friendly
- Professional tone
`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant', // ✅ SUPPORTED & FAST
    messages: [
      { role: 'system', content: 'You are a professional content editor.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 600
  });

  return response.choices[0].message.content;
};
