const admin = require('firebase-admin');

admin.initializeApp(); // need this to have access to the Admin object

const db = admin.firestore();

module.exports = { admin, db };