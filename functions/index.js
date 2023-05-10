// // The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
// const { logger } = require("firebase-functions");
// const { onRequest } = require("firebase-functions/v2/https");
// const { onDocumentCreated } = require("firebase-functions/v2/firestore");

// // The Firebase Admin SDK to access Firestore.
// const { initializeApp } = require("firebase-admin/app");
// const { getFirestore } = require("firebase-admin/firestore");

// initializeApp();

// // Take the text parameter passed to this HTTP endpoint and insert it into
// // Firestore under the path /messages/:documentId/original
// exports.addmessage = onRequest(async (req, res) => {
//   // Grab the text parameter.
//   const original = req.query.text;
//   // Push the new message into Firestore using the Firebase Admin SDK.
//   const writeResult = await getFirestore()
//     .collection("messages")
//     .add({ original: original });
//   // Send back a message that we've successfully written the message
//   res.json({ result: `Message with ID: ${writeResult.id} added.` });
// });

// // Listens for new messages added to /messages/:documentId/original
// // and saves an uppercased version of the message
// // to /messages/:documentId/uppercase
// exports.makeuppercase = onDocumentCreated("/messages/{documentId}", (event) => {
//   // Grab the current value of what was written to Firestore.
//   const original = event.data.data().original;

//   // Access the parameter `{documentId}` with `event.params`
//   logger.log("Uppercasing", event.params.documentId, original);

//   const uppercase = original.toUpperCase();

//   // You must return a Promise when performing
//   // asynchronous tasks inside a function
//   // such as writing to Firestore.
//   // Setting an 'uppercase' field in Firestore document returns a Promise.
//   return event.data.ref.set({ uppercase }, { merge: true });
// });

// // Loop through all documents in the collection "children/{childId}/entries"
// // and convert the field "startDate" from a string to a date
// exports.convertStartDateOnAllEntries = onRequest(async (req, res) => {
//   const children = await getFirestore().collection("children").get();
//   children.forEach(async (child) => {
//     const entries = await getFirestore()
//       .collection("children")
//       .doc(child.id)
//       .collection("entries")
//       .get();
//     entries.forEach(async (entry) => {
//       const startDate = new Date(entry.data().startDate);
//       await getFirestore()
//         .collection("children")
//         .doc(child.id)
//         .collection("entries")
//         .doc(entry.id)
//         .update({ startDate: startDate });
//     });
//   });
//   res.json({ result: `Converted startDate to date for all entries.` });
// });

// // Loop through all documents in the collection "children/{childId}/entries"
// // and create a new propety called "endDate".
// // The value of "endDate" is computed from the value of "startDate" and "time".
// exports.setEndDateOnAllEntries = onRequest(async (req, res) => {
//   const children = await getFirestore().collection("children").get();
//   children.forEach(async (child) => {
//     const entries = await getFirestore()
//       .collection("children")
//       .doc(child.id)
//       .collection("entries")
//       .get();
//     entries.forEach(async (entry) => {
//       const startDate = entry.data().startDate;
//       let endDate = new Date(startDate);
//       const time = entry.data().time;

//       if (time) {
//         const leftStopwatchLastUpdateTime =
//           entry.data().leftStopwatchLastUpdateTime;
//         const rightStopwatchLastUpdateTime =
//           entry.data().rightStopwatchLastUpdateTime;
//         let lastStopwatchUpdateTime = null;
//         if (leftStopwatchLastUpdateTime == null) {
//           lastStopwatchUpdateTime = rightStopwatchLastUpdateTime;
//         } else if (rightStopwatchLastUpdateTime == null) {
//           lastStopwatchUpdateTime = leftStopwatchLastUpdateTime;
//         } else {
//           lastStopwatchUpdateTime = Math.max(
//             leftStopwatchLastUpdateTime,
//             rightStopwatchLastUpdateTime
//           );
//         }
//         if (lastStopwatchUpdateTime != null) {
//           const lastStopwatchUpdateTimeDate = new Date(lastStopwatchUpdateTime);
//           const timeDate = new Date(startDate);
//           timeDate.setMilliseconds(timeDate.getMilliseconds() + time);
//           if (lastStopwatchUpdateTimeDate > timeDate) {
//             endDate = lastStopwatchUpdateTimeDate;
//           } else {
//             endDate = timeDate;
//           }
//         } else {
//           endDate = new Date(startDate);
//           endDate.setMilliseconds(endDate.getMilliseconds() + time);
//         }
//       }

//       await getFirestore()
//         .collection("children")
//         .doc(child.id)
//         .collection("entries")
//         .doc(entry.id)
//         .update({ endDate: endDate });
//     });
//   });
//   res.json({ result: `Added endDate to all entries.` });
// });
