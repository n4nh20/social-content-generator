const { GoogleGenerativeAI } = require('@google/generative-ai');

if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Initialize the model with gemini-pro-vision
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// Test the connection
const testConnection = async () => {
    try {
        const result = await model.generateContent('Test connection');
        console.log('Successfully connected to Google AI');
        return true;
    } catch (error) {
        console.error('Failed to connect to Google AI:', error.message);
        return false;
    }
};

module.exports = {
    model,
    testConnection
}; 