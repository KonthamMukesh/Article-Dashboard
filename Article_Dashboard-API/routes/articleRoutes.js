const express = require('express');
const router = express.Router();
const controller = require('../controllers/articleController');

// ✅ POST only (clean & correct)
router.post('/run-phase2', async (req, res) => {
  try {
    const { articleId } = req.body;
    await controller.processArticle(articleId);

    res.json({
      success: true,
      message: "AI article generated successfully"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
