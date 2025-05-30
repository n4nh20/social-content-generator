const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables first
dotenv.config();

// Then initialize Firebase
const { initializeFirebase, ensureDatabase } = require('./config/firebase');

// Initialize Firebase
initializeFirebase();

// Import routes
const authRoutes = require('./routes/authRoutes');
const contentRoutes = require('./routes/contentRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);

app.get('/', (req, res) => {
    res.send('Social Content Generator API');
});

// Verify database connection and start server
const PORT = process.env.PORT || 5001;

const startServer = async () => {
    try {
        // Verify database connection
        await ensureDatabase();

        // Start server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer(); 