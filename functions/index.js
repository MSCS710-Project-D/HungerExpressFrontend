/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const admin = require("firebase-admin");
const functions = require("firebase-functions");

admin.initializeApp();

functions.runWith({maxInstances: 10});

const {onRequest} = require("firebase-functions/v2/https");
const {logger} = require("firebase-functions");

const myFunction = onRequest((request, response) => {
  logger.info("This is a log message", {structuredData: true});
  response.send("Response from myFunction");
});

exports.myFunction = myFunction;

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
