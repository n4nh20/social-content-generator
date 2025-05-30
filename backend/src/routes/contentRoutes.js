const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');

// Generate captions
router.post('/generate-captions', contentController.generatePostCaptions);

// Get post ideas
router.post('/get-ideas', contentController.getPostIdeas);

// Create captions from ideas
router.post('/create-captions-from-idea', contentController.createCaptionsFromIdeas);

// Save content
router.post('/save', contentController.saveContent);

// Get user's saved contents
router.get('/user-contents', contentController.getUserGeneratedContents);

// Unsave content
router.post('/unsave', contentController.unsaveContent);

module.exports = router; 