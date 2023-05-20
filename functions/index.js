// // The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
// const { logger } = require("firebase-functions");
// const { onRequest } = require("firebase-functions/v2/https");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
// const { onDocumentCreated } = require("firebase-functions/v2/firestore");

// // The Firebase Admin SDK to access Firestore.
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp();

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

exports.addParent = onCall(async (request) => {
  // Validate input parameters
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "User is not authenticated.");
  }

  // Data passed from the client.
  const { childId, parentEmail } = request.data;
  // Authentication / user information is automatically added to the request.
  const uid = request.auth.uid;
  const name = request.auth.token.name || null;
  const picture = request.auth.token.picture || null;
  const email = request.auth.token.email || null;

  if (!childId || !parentEmail) {
    throw new HttpsError(
      "invalid-argument",
      "Missing child ID or parent email."
    );
  }

  // Check the user doc to see if its "selectedChild" field matches the childId
  const userRef = getFirestore().collection("users").doc(uid);
  const userSnapshot = await userRef.get();
  const userData = userSnapshot.data();
  const selectedChild = userData.selectedChild;
  if (selectedChild !== childId) {
    throw new HttpsError(
      "permission-denied",
      "User does not have permission to add parent to this child."
    );
  }

  // Retrieve the parent's user doc
  const parentUserDoc = await getFirestore()
    .collection("users")
    .where("email", "==", parentEmail)
    .limit(1)
    .get();
  const parentUserData = parentUserDoc.docs[0].data();
  if (!parentUserData) {
    throw new HttpsError(
      "not-found",
      `Parent user does not exist with email: ${parentEmail}`
    );
  }
  // Check if child is already within the "children" array
  const isChildAlreadyAdded = parentUserData.children.some(
    (child) => child.id === childId
  );
  if (isChildAlreadyAdded) {
    throw new HttpsError(
      "already-exists",
      "Parent already has access to this child."
    );
  }

  // Retrieve child document
  const childRef = getFirestore().collection("children").doc(childId);
  const childSnapshot = await childRef.get();
  if (!childSnapshot.exists) {
    throw new HttpsError("not-found", "Child document does not exist.");
  }
  const childData = childSnapshot.data();
  // Check if parent email is already present
  const isParentAlreadyAdded = childData.parents.some(
    (parent) => parent === parentUserData.uid
  );
  if (isParentAlreadyAdded) {
    throw new HttpsError("already-exists", "Parent email already added.");
  }

  // Parent exists and child exists, so add parent to child's parents array and child to parent's children array
  const updatedParents = [...childData.parents, parentUserData.uid];
  await childRef.update({ parents: updatedParents });
  const updatedChildren = [...parentUserData.children, childSnapshot.id];
  await getFirestore()
    .collection("users")
    .doc(parentUserData.uid)
    .update({ children: updatedChildren, selectedChild: childSnapshot.id });

  //   if (!childSnapshot.exists) {
  //     throw new functions.https.HttpsError(
  //       "not-found",
  //       "Child document does not exist."
  //     );
  //   }

  //   const childData = childSnapshot.data();

  // Check if parent email is already present
  //   const isParentAlreadyAdded = childData.parents.some(
  //     (parent) => parent.email === parentEmail
  //   );
  //   if (isParentAlreadyAdded) {
  //     throw new functions.https.HttpsError(
  //       "already-exists",
  //       "Parent email already added."
  //     );
  //   }

  // Generate access code
  //   const accessCode = "TEST";

  // Add the new parent to the child's parents array
  //   const updatedParents = [
  //     ...childData.parents,
  //     {
  //       email: parentEmail,
  //       accessCode: accessCode,
  //     },
  //   ];

  // Update child document with the new parent
  //   await childRef.update({ parents: updatedParents });

  // Return the access code to the client-side code
  return { success: true };
});
