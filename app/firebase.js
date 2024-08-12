// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWmxEk58polMVFm2QJCv6qR4RQ1fqCwNU",
  authDomain: "pantry-tracker-8de8a.firebaseapp.com",
  projectId: "pantry-tracker-8de8a",
  storageBucket: "pantry-tracker-8de8a.appspot.com",
  messagingSenderId: "719807999569",
  appId: "1:719807999569:web:743dc02ba495906383d270",
  measurementId: "G-3YWRVYVTSD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
export{app, firestore}