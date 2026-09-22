const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Question = require('../models/Question');

let isMongoConnected = false;
let memoryQuestions = [];
let memoryResults = [];

// Load questions from local JSON file
const loadLocalQuestions = () => {
  try {
    const jsonPath = path.resolve(__dirname, '../../cpale_questions.json');
    if (fs.existsSync(jsonPath)) {
      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      memoryQuestions = data.questions || [];
      console.log(`Loaded ${memoryQuestions.length} questions from local cpale_questions.json`);
    }
  } catch (err) {
    console.error('Error loading local cpale_questions.json:', err.message);
  }
};

const connectDB = async () => {
  loadLocalQuestions();
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cpale_reviewer';

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2500
    });
    isMongoConnected = true;
    console.log('MongoDB Connected Successfully to:', mongoURI);

    // Auto seed if empty in MongoDB
    const count = await Question.countDocuments();
    if (count === 0 && memoryQuestions.length > 0) {
      console.log('Seeding MongoDB with initial questions...');
      await Question.insertMany(memoryQuestions);
      console.log(`Successfully seeded ${memoryQuestions.length} questions to MongoDB.`);
    }
  } catch (error) {
    isMongoConnected = false;
    console.warn('MongoDB connection failed or unavailable. Falling back to built-in high-performance store.', error.message);
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
      createdAt: new Date(),
      updatedAt: new Date()
    };
    memoryResults.unshift(item);
    return item;
  }
};
