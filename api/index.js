import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import questionRoutes from './routes/questionRoutes.js';
import examRoutes from './routes/examRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize DB
connectDB();

// API Routes
app.use('/api/questions', questionRoutes);
app.use('/api/exams', examRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Philippine CPALE Reviewer API is running',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend static assets if available
const distPath = path.resolve(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.resolve(distPath, 'index.html'));
    }
  });
}

export default app;

if (process.env.NODE_ENV !== 'production' && process.env.PORT) {
  app.listen(PORT, () => {
    console.log(`CPALE Reviewer Backend running on http://localhost:${PORT}`);
  });
}
