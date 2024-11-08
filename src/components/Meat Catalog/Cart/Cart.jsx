import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./Cart.module.css";
import { LuMoveLeft } from "react-icons/lu";
import CheckOutForm from "../Check Out Form/CheckOutForm";
import { Context } from "../../../App";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../firebase/setup";
import { SiTicktick } from "react-icons/si";
import { db } from "../../firebase/setup";
import { set, ref } from "firebase/database";
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  updateDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";

const Cart = () => {
  const { order, setOrder, goatsData } = useContext(Context);
  const [showOtpInputPopup, setShowOtpInputPopup] = useState(false);
  const [showVerificationLoading, setShowVerificationLoading] = useState(false);
  const [showConfirmationLoading, setShowConfirmationLoading] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState(false);
  const [newlyFetchedGoatsData, setNewlyFetchedGoatsData] = useState([]);
  const [showOtpError, setShowOtpError] = useState("");

  const navigate = useNavigate();

  const keyNames = {
    numberOfMuttonShares: "Mutton",
    numberOfHeadShares: "Head",
    numberOfLegsShares: "Legs",
    numberOfBrainShares: "Brain",
    numberOfBotiShares: "Boti",
    numberOfExtras: "Extras",
  };

  const priceNames = {
    numberOfMuttonShares: "muttonShareCost",
    numberOfHeadShares: "headPrice",
    numberOfLegsShares: "legsPrice",
    numberOfBrainShares: "brainPrice",
    numberOfBotiShares: "botiShareCost",
    numberOfExtras: "extraCost",
  };

  const mapping = {
    numberOfMuttonShares: "remainingMuttonShares",
    numberOfHeadShares: "remainingHeads",
    numberOfLegsShares: "remainingLegs",
    numberOfBrainShares: "remainingBrains",
    numberOfBotiShares: "remainingBotiShares",
    numberOfExtras: "remainingExtras",
  };

  // Phone Auth
  const [confirmation, setConfirmation] = useState();

  const updateGoatDataQuantities = async () => {
    for (const requirement of order.meatRequirements) {
      // const goatRef = db.collection("goats").doc(requirement.goatId);
      const goatRef = doc(db, "goats", requirement.goatId);
      try {
        const goatDoc = await getDoc(goatRef);

        if (!goatDoc) {
          alert(`Goat with ID ${requirement.goatId} not found.`);
          return false;
        }

        const goatData = goatDoc.data();

        const isAvailable = Object.keys(requirement).every((key) => {
          if (key !== "goatId" && requirement[key] !== undefined) {
            const goatField = mapping[key];
            if (goatField) {
              // Check if the availability is sufficient for this key
              return goatData[goatField] >= requirement[key];
            }
          }
          return true;
        });

        if (isAvailable) {
          // Create the object for updates
          const updateData = {};

          Object.keys(requirement).forEach((key) => {
            if (key !== "goatId" && mapping[key]) {
              const goatField = mapping[key];
              const updatedValue = goatData[goatField] - requirement[key];

              if (!isNaN(updatedValue)) {
                updateData[goatField] = updatedValue;
              }
            }
          });

          if (Object.keys(updateData).length > 0) {
            await updateDoc(goatRef, updateData);
          } else {
            console.error("No valid fields to update.");
            return false;
          }
        } else {
          console.error("Not enough availability for the requested order.");
          return false;
        }
      } catch (error) {
        console.error(
          `Error updating goat data for docId: ${requirement.goatId}`,
          error
        );
        return false;
      }
    }

    console.log("All quantities successfully updated.");
    return true;
  };

  const placeOrder = async () => {
    setShowConfirmationLoading(true);
    try {
      if (updateGoatDataQuantities()) {
        const docRef = await addDoc(collection(db, "orders"), order);
        console.log("Document written with ID: ", docRef.id);
        setShowConfirmationLoading(false);
        setOrderConfirmation(true);
      } else {
        alert("No shares left");
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const sendOtp = async (e) => {
    try {
      const recaptcha = new RecaptchaVerifier(auth, "recaptcha", {
        size: "invisible",
      });
      const confirmation = await signInWithPhoneNumber(
        auth,
        "+91 " + order.userPhoneNumber,
        recaptcha
      );
      console.log("confirmation", confirmation);
      setConfirmation(confirmation);
      setShowOtpInputPopup(true);
    } catch (error) {
      console.log(error);
    }
  };

  const verifyOtp = async () => {
    setShowOtpInputPopup(false);
    setShowOtpInputPopup(true);
    try {
      const otpValue = otp.join("");
      const otpConfirmation = await confirmation.confirm(otpValue);
      console.log("otp verification resp", otpConfirmation);

      window.localStorage.setItem(
        "choose-your-goat-token",
        otpConfirmation.user.accessToken
      );

      setShowOtpInputPopup(false);

      setUser(otpConfirmation.user.uid, {
        userName: order.userName,
        userPhoneNumber: order.userPhoneNumber,
      });

      setUserAddress({
        userId: order.userId,
        userAddress: order.userAddress,
      });
      console.log("Setted!!!!!!");
      placeOrder();
    } catch (error) {
      setShowOtpInputPopup(true);
      setShowOtpError(true);
      console.log(error);
    }
  };

  const setUser = async (userId, userData) => {
    try {
      await setDoc(doc(collection(db, "users"), userId), userData);
      console.log("User created successfully");
    } catch (error) {
      console.log("error in creating user", error);
    }
  };

  const setUserAddress = async (userData) => {
    try {
      await setDoc(doc(collection(db, "addresses")), userData);
    } catch (error) {
      console.log("error in setting user address", error);
    }
  };

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d$/.test(value) || value === "") {
      // Update the OTP array
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to the next input if a digit was entered
      if (value !== "" && index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      // Move focus to the previous input if it's empty
      inputRefs.current[index - 1].focus();
    }
  };

  useEffect(() => {
    if (order.meatRequirements.length <= 0) {
      window.location.href = "/";
    }
  });

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.backBar}>
          <div className={styles.backBtn} onClick={() => navigate("/")}>
            <i>
              <LuMoveLeft size={20} />
            </i>
            <p>Back</p>
          </div>
        </div>
        <div className={styles.carts}>
          {order.meatRequirements.map((goatObj, index) => (
            <div className={styles.cartItemsWrap} key={index}>
              {Object.keys(goatObj).map((keyName) => {
                if (keyNames[keyName]) {
                  return (
                    <div className={styles.cartItem} key={keyName}>
                      <div className={styles.priceValues}>
                        <p>
                          {keyNames[keyName]} ( {goatObj[keyName]} shares )
                        </p>
                        {/* <div className={styles.quantityButtons}>
                          <button>-</button>
                          <input
                            type="text"
                            id={keyName}
                            readOnly
                            value={goatObj[keyName]}
                          />
                          <button>+</button>
                        </div> */}
                      </div>
                      <p>
                        ₹
                        {goatObj[keyName] *
                          (goatsData.find(
                            (item) => item.docId === goatObj.goatId
                          )
                            ? goatsData.find(
                                (item) => item.docId === goatObj.goatId
                              )[priceNames[keyName]]
                            : 0)}
                        /-
                      </p>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          ))}

          <div className=" w-full divide-y divide-gray-200 px-4 dark:divide-gray-800">
            <dl className="flex items-center justify-between gap-4 py-3">
              <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                Subtotal
              </dt>
              <dd className="text-base font-medium text-gray-900 dark:text-white">
                ₹ {order.totalBill}
              </dd>
            </dl>
          </div>

          {/* <div className={styles.cartItemsWrap}>
            <div className={styles.cartItem}>
              <p>Mutton</p>
              <div className={styles.quantityButtons}>
                <button>-</button>
                <input
                  type="text"
                  id="numberOfMuttonShares"
                  readOnly
                  value={20}
                />
                <button>+</button>
              </div>

              <p>₹ {2 * 400}/-</p>
            </div>
            <div className={styles.cartItem}>
              <p>Talkaya</p>
              <div className={styles.quantityButtons}>
                <button>-</button>
                <input
                  type="text"
                  id="numberOfMuttonShares"
                  readOnly
                  value={20}
                />
                <button>+</button>
              </div>

              <p>₹ {350}/-</p>
            </div>
          </div> */}
        </div>
        {/* <div className="-my-3 divide-y divide-gray-200 px-4 dark:divide-gray-800">
          <dl className="flex items-center justify-between gap-4 py-3">
            <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
              Subtotal
            </dt>
            <dd className="text-base font-medium text-gray-900 dark:text-white">
              ₹ {order.totalBill}
            </dd>
          </dl>
        </div> */}
        <div id="recaptcha"></div>

        <CheckOutForm sendOtp={sendOtp} placeOrder={placeOrder} />
      </div>

      {/* <div className={styles.form}>
        <button onClick={sendOtp}>Send OTP</button>
        <div id="recaptcha"></div>
        <button onClick={verifyOtp}>Verify OTP</button>
      </div> */}

      {showOtpInputPopup && (
        <div className={styles.verifyOtpContainer}>
          <h6>Verify your mobile number</h6>
          <div className={styles.otpInputContainer}>
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
                className={styles.otpInput}
              />
            ))}
          </div>
          {showOtpError && <span>Please enter a valid OTP</span>}
          <button onClick={verifyOtp} className={styles.verifyButton}>
            Verify
          </button>
        </div>
      )}

      {showVerificationLoading && (
        <div className={styles.verifyOtpContainer}>
          <div className={styles.loader}></div>

          <h6>Please Wait While We Verify You Mobile Number!</h6>
        </div>
      )}

      {showConfirmationLoading && (
        <div className={styles.verifyOtpContainer}>
          <div className={styles.loader}></div>

          <h6>Confirming Your Order!</h6>
        </div>
      )}

      {orderConfirmation && (
        <div class={styles.verifyOtpContainer}>
          <div class={styles.popupContent}>
            <div class={styles.checkmark}>
              <SiTicktick color="green" size={40} />
            </div>
            <h1>Your order is confirmed!</h1>
            <p>Thank you for your order</p>
            <button
              class={styles.goHomeBtn}
              onClick={() => (window.location.href = "/")}
            >
              Go Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
