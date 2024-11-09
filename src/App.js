import React, { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Catalog from "./components/Meat Catalog/Catalog";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Cart from "./components/Meat Catalog/Cart/Cart";
import { db } from "./components/firebase/setup";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { jwtDecode } from "jwt-decode";

export const Context = React.createContext();

const App = () => {
  const [goatsData, setGoatsData] = useState([]);
  const [order, setOrder] = useState({
    meatRequirements: [],
    userName: "",
    userPhoneNumber: "",
    userAddress: "",
    gpsLocation: "",
    totalBill: 0,
  });

  const getUser = async (userId) => {
    try {
      const userDoc = (await getDoc(doc(db, "users", userId))).data();
      console.log("userDoc", userDoc);
      return userDoc;
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "goats"), (snapshot) => {
      const updatedGoatsData = snapshot.docs.map((doc) => ({
        docId: doc.id,
        ...doc.data(),
      }));
      setGoatsData(updatedGoatsData);
      console.log(updatedGoatsData);
    });

    const fetchUserData = async () => {
      const userToken = localStorage.getItem("choose-your-goat-token");

      if (userToken) {
        const decodedToken = jwtDecode(userToken);
        console.log("user token exists in local");

        try {
          const user = await getUser(decodedToken.sub);
          console.log("user", user);

          setOrder((prev) => ({
            ...prev,
            userId: decodedToken.sub,
            userPhoneNumber: user?.userPhoneNumber,
            userName: user?.userName,
          }));
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }

        console.log("decodedToken", decodedToken);
      }
    };

    fetchUserData();

    return () => unsubscribe();
  }, []);

  return (
    <Context.Provider value={{ order, setOrder, goatsData, setGoatsData }}>
      <div className="appContainer">
        <Navbar />
        <BrowserRouter>
          <Routes>
            <Route path="/" index element={<Catalog />} />
            <Route path="cart" element={<Cart />} />
          </Routes>
        </BrowserRouter>
      </div>
    </Context.Provider>
  );
};

export default App;

// // import React, { useState } from "react";
// // // import { auth } from "./firebase"; // import the auth object
// // import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// // import { initializeApp } from "firebase/app";
// // import { getAuth } from "firebase/auth";

// // const firebaseConfig = {
// //   apiKey: "YOUR_API_KEY",
// //   authDomain: "YOUR_AUTH_DOMAIN",
// //   projectId: "YOUR_PROJECT_ID",
// //   storageBucket: "YOUR_STORAGE_BUCKET",
// //   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
// //   appId: "YOUR_APP_ID",
// // };

// // const firebaseConfig = {
// //   apiKey: "AIzaSyCb_wY3T-iSJsOKJVKaQQW2uj2_pKov-v0",
// //   authDomain: "choose-your-goat.firebaseapp.com",
// //   projectId: "choose-your-goat",
// //   storageBucket: "choose-your-goat.firebasestorage.app",
// //   messagingSenderId: "636547426141",
// //   appId: "1:636547426141:web:d119716b29324503ef6ab4",
// //   measurementId: "G-8Z27YTXK08",
// // };

// // const app = initializeApp(firebaseConfig);
// // const auth = getAuth(app);

// // function PhoneSignIn() {
// //   const [phoneNumber, setPhoneNumber] = useState("");
// //   const [verificationCode, setVerificationCode] = useState("");
// //   const [confirmationResult, setConfirmationResult] = useState(null);

// //   auth().settings.appVerificationDisabledForTesting = true;

// //   // Initialize reCAPTCHA
// //   const setupRecaptcha = () => {
// //     window.recaptchaVerifier = new RecaptchaVerifier(
// //       auth,
// //       "sign-in-button",
// //       {
// //         size: "invisible",
// //         callback: (response) => {
// //           // reCAPTCHA solved, allow signInWithPhoneNumber.
// //           onSignInSubmit();
// //         },
// //       },
// //       auth
// //     );
// //   };

// //   const onSignInSubmit = (e) => {
// //     e.preventDefault();
// //     setupRecaptcha();
// //     const appVerifier = window.recaptchaVerifier;

// //     signInWithPhoneNumber(auth, "+919346926366", appVerifier)
// //       .then((confirmationResult) => {
// //         // SMS sent, prompt the user to enter the code.
// //         console.log("confirmationResult", confirmationResult);
// //         setConfirmationResult(confirmationResult);
// //         alert("SMS sent! Please enter the verification code.");
// //       })
// //       .catch((error) => {
// //         console.error("Error during sign in:", error);
// //       });
// //   };

// //   const onVerifyCodeSubmit = (e) => {
// //     e.preventDefault();
// //     if (confirmationResult) {
// //       confirmationResult
// //         .confirm(verificationCode)
// //         .then((result) => {
// //           // User signed in successfully.
// //           console.log("Verification result", result);
// //           alert("User signed in successfully!");
// //         })
// //         .catch((error) => {
// //           console.error("Error verifying code:", error);
// //         });
// //     }
// //   };

// //   return (
// //     <div>
// //       <h2>Phone Sign-In</h2>
// //       <form onSubmit={onSignInSubmit}>
// //         <input
// //           type="text"
// //           value={phoneNumber}
// //           onChange={(e) => setPhoneNumber(e.target.value)}
// //           placeholder="Enter phone number"
// //         />
// //         <button id="sign-in-button" type="submit">
// //           Sign In
// //         </button>
// //       </form>

// //       {confirmationResult && (
// //         <form onSubmit={onVerifyCodeSubmit}>
// //           <input
// //             type="text"
// //             value={verificationCode}
// //             onChange={(e) => setVerificationCode(e.target.value)}
// //             placeholder="Enter verification code"
// //           />
// //           <button type="submit">Verify Code</button>
// //         </form>
// //       )}
// //     </div>
// //   );
// // }

// // export default PhoneSignIn;
