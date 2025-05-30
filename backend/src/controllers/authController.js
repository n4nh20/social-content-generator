const { db } = require('../config/firebase');
const twilioClient = require('../config/twilio');

// Force development mode for testing
const isDevelopment = true; // process.env.NODE_ENV === 'development';

// Generate random 6-digit code
const generateAccessCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Format phone number for Twilio
const formatPhoneNumber = (phoneNumber) => {
    // Remove any non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');

    // Add country code if not present
    if (!cleaned.startsWith('84') && !cleaned.startsWith('+84')) {
        return `+84${cleaned.startsWith('0') ? cleaned.slice(1) : cleaned}`;
    }

    return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
};

// Create new access code
const createNewAccessCode = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        const accessCode = generateAccessCode();
        const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

        // Save to Firebase
        const userRef = db.collection('users').doc(formattedPhoneNumber);
        await userRef.set({
            accessCode,
            createdAt: new Date().toISOString()
        }, { merge: true }); // Use merge option to avoid overwriting existing data

        if (isDevelopment) {
            // In development, return the code directly
            console.log(`[DEV MODE] Access code for ${formattedPhoneNumber}: ${accessCode}`);
            res.json({
                success: true,
                message: '[DEV MODE] SMS not sent',
                accessCode, // Only include in development
                note: 'Development mode is enabled. In production, the code will be sent via SMS.'
            });
        } else {
            // In production, send real SMS
            await twilioClient.messages.create({
                body: `Your access code is: ${accessCode}`,
                to: formattedPhoneNumber,
                from: process.env.TWILIO_PHONE_NUMBER
            });
            res.json({ success: true });
        }
    } catch (error) {
        console.error('Error creating access code:', error);
        res.status(500).json({
            error: 'Failed to create access code',
            details: isDevelopment ? error.message : undefined
        });
    }
};

// Validate access code
const validateAccessCode = async (req, res) => {
    try {
        const { phoneNumber, accessCode } = req.body;
        const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

        const userDoc = await db.collection('users').doc(formattedPhoneNumber).get();

        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userData = userDoc.data();

        if (userData.accessCode !== accessCode) {
            return res.status(400).json({ error: 'Invalid access code' });
        }

        // Clear access code after successful validation
        await db.collection('users').doc(formattedPhoneNumber).update({
            accessCode: ''
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Error validating access code:', error);
        res.status(500).json({
            error: 'Failed to validate access code',
            details: isDevelopment ? error.message : undefined
        });
    }
};

module.exports = {
    createNewAccessCode,
    validateAccessCode
}; 