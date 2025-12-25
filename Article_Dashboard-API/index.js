require('dotenv').config(); // 🔥 MUST be first
const express = require('express');
const cors = require('cors');

const app = express();

// ✅ ALLOW REACT
app.use(cors({
  origin: 'http://localhost:3001', // React port
  methods: ['GET', 'POST'],
}));

app.use(express.json());

// routes
const articleRoutes = require('./routes/articleRoutes');
app.use(articleRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Phase-2 running on port ${PORT}`);
});
