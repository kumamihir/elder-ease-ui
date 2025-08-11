const mongoose = require('mongoose');

async function connectToDatabase(mongoUri) {
  mongoose.set('strictQuery', true);
  try {
    await mongoose.connect(mongoUri, {
      autoIndex: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
}

module.exports = { connectToDatabase };