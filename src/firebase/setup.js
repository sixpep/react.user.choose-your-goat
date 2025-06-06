import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

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
const messaging = getMessaging(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export { messaging, getToken, onMessage };

// //------- Test Config --------
// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCLVrnCHyDF1sa3YXHkZzCUj0iRBd5zJ18",
//   authDomain: "test-choose-your-goat.firebaseapp.com",
//   projectId: "test-choose-your-goat",
//   storageBucket: "test-choose-your-goat.firebasestorage.app",
//   messagingSenderId: "128222454137",
//   appId: "1:128222454137:web:990c0e513fdd76e3dc8fa8",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
// export const auth = getAuth(app);
