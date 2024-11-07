import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCb_wY3T-iSJsOKJVKaQQW2uj2_pKov-v0",
  authDomain: "choose-your-goat.firebaseapp.com",
  projectId: "choose-your-goat",
  storageBucket: "choose-your-goat.firebasestorage.app",
  messagingSenderId: "636547426141",
  appId: "1:636547426141:web:d119716b29324503ef6ab4",
  measurementId: "G-8Z27YTXK08",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
