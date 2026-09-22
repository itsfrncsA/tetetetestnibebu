const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize DB
connectDB();

// API Routes
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/exams', require('./routes/examRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Philippine CPALE Reviewer API is running',
    timestamp: new Date().toISOString()
  });
});

// For local direct execution
if (process.env.NODE_ENV !== 'production' && require.main === module) {
  app.listen(PORT, () => {
    console.log(`CPALE Reviewer Backend running on http://localhost:${PORT}`);
  });
}

// Export for Vercel Serverless Function
module.exports = app;
