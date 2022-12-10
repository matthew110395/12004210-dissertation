// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyABeHwTqws0VeJlgPmehuxyz9-nd2Y9yf0",
  authDomain: "dissertation-feed8.firebaseapp.com",
  projectId: "dissertation-feed8",
  storageBucket: "dissertation-feed8.appspot.com",
  messagingSenderId: "272008450563",
  appId: "1:272008450563:web:4d1acde765438a8093b436",
  measurementId: "G-SR6VHP05JY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);