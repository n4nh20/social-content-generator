const { db } = require('../config/firebase');
const { model } = require('../config/gemini');

// Generate post captions
const generatePostCaptions = async (req, res) => {
    try {
        const { socialNetwork, subject, tone } = req.body;

        const prompt = `Create 5 engaging social media captions for ${socialNetwork} about ${subject} with a ${tone} tone. Each caption should be unique and optimized for ${socialNetwork}'s format.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const captions = response.text().split('\n').filter(caption => caption.trim());

        res.json({ captions: captions.slice(0, 5) });
    } catch (error) {
        console.error('Error generating captions:', error);
        res.status(500).json({
            error: 'Failed to generate captions',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get post ideas
const getPostIdeas = async (req, res) => {
    try {
        const { topic } = req.body;

        const prompt = `Generate 10 creative and engaging social media post ideas about ${topic}. Each idea should be unique and attention-grabbing.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const ideas = response.text().split('\n').filter(idea => idea.trim());

        res.json({ ideas: ideas.slice(0, 10) });
    } catch (error) {
        console.error('Error generating ideas:', error);
        res.status(500).json({ error: 'Failed to generate ideas' });
    }
};

// Create captions from ideas
const createCaptionsFromIdeas = async (req, res) => {
    try {
        const { idea } = req.body;

        const prompt = `Create 5 engaging social media captions based on this idea: "${idea}". Make each caption unique and compelling.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const captions = response.text().split('\n').filter(caption => caption.trim());

        res.json({ captions: captions.slice(0, 5) });
    } catch (error) {
        console.error('Error generating captions from idea:', error);
        res.status(500).json({ error: 'Failed to generate captions' });
    }
};

// Save content
const saveContent = async (req, res) => {
    try {
        const { phoneNumber, topic, data, socialNetwork, tone } = req.body;

        if (!phoneNumber || !data) {
            return res.status(400).json({
                success: false,
                message: 'Phone number and content data are required'
            });
        }

        const contentRef = db.collection('contents').doc();
        await contentRef.set({
            phoneNumber,
            topic: topic || 'Untitled',
            data,
            socialNetwork,
            tone,
            createdAt: new Date().toISOString()
        });

        res.status(200).json({
            success: true,
            message: 'Content saved successfully',
            data: {
                id: contentRef.id,
                phoneNumber,
                topic,
                data,
                socialNetwork,
                tone
            }
        });
    } catch (error) {
        console.error('Error saving content:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save content',
            error: error.message
        });
    }
};

// Get user generated contents
const getUserGeneratedContents = async (req, res) => {
    try {
        const { phone_number } = req.query;
        console.log('Fetching contents for phone number:', phone_number);

        if (!phone_number) {
            return res.status(400).json({
                success: false,
                message: 'Phone number is required'
            });
        }

        const contentsRef = db.collection('contents');
        console.log('Getting contents from collection');

        // Simplified query that only filters by phoneNumber
        const snapshot = await contentsRef
            .where('phoneNumber', '==', phone_number)
            .get();

        console.log('Query executed, documents count:', snapshot.size);

        // Sort the results in memory
        const contents = [];
        snapshot.forEach(doc => {
            contents.push({
                id: doc.id,
                ...doc.data()
            });
        });

        // Sort by createdAt in descending order
        contents.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB - dateA;
        });

        console.log('Processed and sorted contents:', contents.length);

        res.status(200).json({
            success: true,
            data: contents
        });
    } catch (error) {
        console.error('Detailed error in getUserGeneratedContents:', {
            message: error.message,
            code: error.code,
            stack: error.stack
        });

        res.status(500).json({
            success: false,
            message: 'Failed to fetch user contents',
            error: error.message
        });
    }
};

// Unsave content
const unsaveContent = async (req, res) => {
    try {
        const { captionId } = req.body;

        if (!captionId) {
            return res.status(400).json({
                success: false,
                message: 'Caption ID is required'
            });
        }

        await db.collection('contents').doc(captionId).delete();

        res.status(200).json({
            success: true,
            message: 'Content deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting content:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete content',
            error: error.message
        });
    }
};

module.exports = {
    generatePostCaptions,
    getPostIdeas,
    createCaptionsFromIdeas,
    saveContent,
    getUserGeneratedContents,
    unsaveContent
}; 