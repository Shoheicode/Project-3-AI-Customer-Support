// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: `${process.env.FIREBASE_API_KEY}`,
  authDomain: "chat-text-bot.firebaseapp.com",
  projectId: "chat-text-bot",
  storageBucket: "chat-text-bot.appspot.com",
  messagingSenderId: "994061601514",
  appId: "1:994061601514:web:6e1b03f019a7bebbb1e593",
  measurementId: "G-F5ZBX0EYN4"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const firestore = getFirestore(app)

export {app, firestore}