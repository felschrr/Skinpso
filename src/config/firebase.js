// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5yvV26MBQscj-HqynZdnC5cLtbI9IB9w",
  authDomain: "cs-skins-eda31.firebaseapp.com",
  projectId: "cs-skins-eda31",
  storageBucket: "cs-skins-eda31.appspot.com",
  messagingSenderId: "514605161235",
  appId: "1:514605161235:web:f1c5fb4d128817314a18e6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };