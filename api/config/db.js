import { cpaleQuestions } from '../data/questionsData.js';

let isMongoConnected = false;
let memoryQuestions = [...cpaleQuestions];
let memoryResults = [];

export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!mongoURI) {
    console.log(`Running in built-in memory mode with ${memoryQuestions.length} bundled questions.`);
    return;
  }

  try {
    const mongoose = (await import('mongoose')).default;
    const Question = (await import('../models/Question.js')).default;
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

export const isMongo = () => isMongoConnected;
export const getMemoryQuestions = () => memoryQuestions;
export const getMemoryResults = () => memoryResults;
export const addMemoryResult = (result) => {
  const item = {
    _id: 'res_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    ...result,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  memoryResults.unshift(item);
  return item;
};
