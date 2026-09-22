const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Question = require('../models/Question');

let isMongoConnected = false;
let memoryQuestions = [];
let memoryResults = [];

const loadLocalQuestions = () => {
  try {
    const bundledData = require('../data/cpale_questions.json');
    if (bundledData && bundledData.questions) {
      memoryQuestions = bundledData.questions;
      console.log(`Loaded ${memoryQuestions.length} questions from bundled data`);
      return;
    }
  } catch (e) {
    // fallback to fs search
    const candidates = [
      path.resolve(__dirname, '../data/cpale_questions.json'),
      path.resolve(__dirname, '../../cpale_questions.json'),
      path.resolve(process.cwd(), 'cpale_questions.json')
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) {
        const data = JSON.parse(fs.readFileSync(p, 'utf8'));
        memoryQuestions = data.questions || [];
        console.log(`Loaded ${memoryQuestions.length} questions from ${p}`);
        break;
      }
    }
  }
};

const connectDB = async () => {
  loadLocalQuestions();
  const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!mongoURI) {
    console.log('No MONGO_URI provided. Running in high-performance in-memory mode.');
    return;
  }

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000
    });
    isMongoConnected = true;
    console.log('MongoDB Connected Successfully.');

    const count = await Question.countDocuments();
    if (count === 0 && memoryQuestions.length > 0) {
      console.log('Seeding MongoDB with questions...');
      await Question.insertMany(memoryQuestions);
      console.log(`Seeded ${memoryQuestions.length} questions.`);
    }
  } catch (error) {
    isMongoConnected = false;
    console.warn('MongoDB connection fallback:', error.message);
  }
};

module.exports = {
  connectDB,
  isMongo: () => isMongoConnected,
  getMemoryQuestions: () => memoryQuestions,
  getMemoryResults: () => memoryResults,
  addMemoryResult: (result) => {
    const item = {
      _id: 'res_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      ...result,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    memoryResults.unshift(item);
    return item;
  }
};
