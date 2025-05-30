const admin = require('firebase-admin');
require('dotenv').config();

let db;

// Initialize Firebase Admin
const initializeFirebase = () => {
    try {
        // Parse the service account JSON from environment variable
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

        if (!serviceAccount.project_id) {
            throw new Error('FIREBASE_SERVICE_ACCOUNT must contain project_id');
        }

        // Initialize the app if it hasn't been initialized yet
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });

            console.log('Firebase Admin initialized successfully');
        }

        // Initialize Firestore with specific database path
        db = admin.firestore();
        const databasePath = `projects/${serviceAccount.project_id}/databases/(default)`;

        // Configure settings
        db.settings({
            ignoreUndefinedProperties: true
        });

        console.log('Firestore initialized successfully with path:', databasePath);

    } catch (error) {
        console.error('Error initializing Firebase:', error);
        throw error;
    }
};

// Helper function to ensure database exists
const ensureDatabase = async () => {
    if (!db) {
        throw new Error('Firestore has not been initialized');
    }

    try {
        // Try to create users collection if it doesn't exist
        const usersRef = db.collection('users');
        await usersRef.doc('test').set({
            test: true,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        await usersRef.doc('test').delete();
        console.log('Database connection verified successfully');
        return true;
    } catch (error) {
        console.error('Error verifying Firestore connection:', error);
        throw error;
    }
};

module.exports = {
    initializeFirebase,
    ensureDatabase,
    get db() {
        if (!db) {
            throw new Error('Firebase has not been initialized. Call initializeFirebase() first.');
        }
        return db;
    }
}; 