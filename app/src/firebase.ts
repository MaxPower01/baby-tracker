// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  connectAuthEmulator,
  getAuth,
} from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { connectStorageEmulator, getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// const authDomain =
//   window.location.hostname === "localhost"
//     ? "localhost"
//     : "baby-tracker-461b4.firebaseapp.com";

const firebaseConfig = {
  apiKey: "AIzaSyBn0IB6Pgovrox-kNXH0IbjtfdPrcSjAn8",
  authDomain: "baby-tracker-461b4.firebaseapp.com",
  projectId: "baby-tracker-461b4",
  storageBucket: "baby-tracker-461b4.appspot.com",
  messagingSenderId: "763042937256",
  appId: "1:763042937256:web:928a53a6d5fd989e83059d",
  measurementId: "G-QQSLB39DY1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

const db = getFirestore(app);

const auth = getAuth(app);

const storage = getStorage(app);

const functions = getFunctions(app);

if (process.env.NODE_ENV === "development") {
  connectFirestoreEmulator(db, "localhost", 8080);
  connectAuthEmulator(auth, "http://localhost:9099");
  connectStorageEmulator(storage, "localhost", 9199);
  connectFunctionsEmulator(functions, "localhost", 5001);
}

const googleAuthProvider = new GoogleAuthProvider();

export { db, auth, googleAuthProvider, storage, functions };
