import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./Cart.module.css";
import { LuMoveLeft } from "react-icons/lu";
import CheckOutForm from "../Check Out Form/CheckOutForm";
import { Context } from "../../../App";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { SiTicktick } from "react-icons/si";
import { db, auth } from "../../../firebase/setup";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, doc, updateDoc, getDoc, setDoc, runTransaction, getDocs, query, where, or } from "firebase/firestore";
import emailjs from "@emailjs/browser";
import axios from "axios";
import { getCurrentDay } from "../../../utils/getDay.utils";
import SelectAddress from "../SelectAddress/SelectAddress";

const Cart = () => {
  const { order, setOrder, goatsData, hensData } = useContext(Context);
  const [showOtpInputPopup, setShowOtpInputPopup] = useState(false);
  const [showVerificationLoading, setShowVerificationLoading] = useState(false);
  const [showConfirmationLoading, setShowConfirmationLoading] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState(false);
  const [showSendingOtpLoading, setShowSendingOtpLoading] = useState(false);
  const [showOtpError, setShowOtpError] = useState("");
  const [confirmation, setConfirmation] = useState();

  const [createNewAddress, setCreateNewAddress] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState("");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const keyNames = {
    numberOfMuttonShares: "Mutton",
    numberOfKeemaShares: "Keema",
    numberOfHeadShares: "Head",
    numberOfLegsShares: "Legs",
    numberOfBrainShares: "Brain",
    numberOfBotiShares: "Boti",
    numberOfExtras: "Extras",
  };
  const priceNames = {
    numberOfMuttonShares: "muttonShareCost",
    numberOfKeemaShares: "keemaShareCost",
    numberOfHeadShares: "headPrice",
    numberOfLegsShares: "legsPrice",
    numberOfBrainShares: "brainPrice",
    numberOfBotiShares: "botiShareCost",
    numberOfExtras: "extraCost",
  };
  const mapping = {
    numberOfMuttonShares: "remainingMuttonShares",
    numberOfKeemaShares: "remainingKeemaShares",
    numberOfHeadShares: "remainingHeads",
    numberOfLegsShares: "remainingLegs",
    numberOfBrainShares: "remainingBrains",
    numberOfBotiShares: "remainingBotiShares",
    numberOfExtras: "remainingExtras",
  };

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

          if (Object.keys(updateData)?.length > 0) {
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
        console.error(`Error updating goat data for docId: ${requirement.goatId}`, error);
        return false;
      }
    }
    console.log("All quantities successfully updated.");
    return true;
  };

  function getCurrentLocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }

  async function handleLocation() {
    try {
      const position = await getCurrentLocation();
      const { latitude, longitude } = position.coords;
      console.log("Lat:", latitude, "Lng:", longitude);
      return { latitude, longitude };
    } catch (error) {
      console.error("Error getting location:", error);
      return { latitude: "", longitude: "" };
    }
  }

  const placeOrder = async (addressSelected = false) => {
    setShowVerificationLoading(false);
    setShowConfirmationLoading(true);

    // //get user name from db, if userName is not present, update it in the db
    try {
      const userRef = doc(db, "users", localStorage.getItem("choose-your-goat-userId"));
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        localStorage.removeItem("choose-your-goat-token");
        localStorage.removeItem("choose-your-goat-userId");
        return alert("User not found");
      }

      const user = userSnap.data();

      if (!user.userName) {
        await updateDoc(userRef, { userName: order.userName });
        console.log("User name updated");
      } else {
        console.log("Username already exists.");
      }
    } catch (error) {
      console.log("User name update failed", error);
      alert(error?.message);
      return;
    }

    /**
     * create a new address document and add its id to the order document.
     */
    let selectedAddressIdByUser = "";
    let userAddressesList = [...order.userAddressesList];
    let currentSelectedAddressDetails = {};

    if (addressSelected) {
      selectedAddressIdByUser = order.selectedAddressId;
      currentSelectedAddressDetails = userAddressesList.find((addr) => addr.id === selectedAddressIdByUser);
    } else {
      try {
        let newAddressDoc = {
          city: order.userCity,
          landmark: order.landmark,
          userAddress: order.userAddress,
          userId: order.userId,
          userPinCode: order.userPinCode,
          geolocation: order.geolocation || { latitude: "", longitude: "" },
          userName: order.userName,
          userPhoneNumber: order.userPhoneNumber,
        };
        const docRef = await addDoc(collection(db, "addresses"), newAddressDoc);

        userAddressesList.push({ id: docRef.id, ...newAddressDoc });
        selectedAddressIdByUser = docRef.id;
        currentSelectedAddressDetails = { id: docRef.id, ...newAddressDoc };
      } catch (error) {
        console.log("Error occured when creating a new address for user.");
        alert("Error occured when saving the address. Please try again.");
        return;
      }
    }

    if (order.orderType === "chicken") {
      const deliveryFee = 20;

      console.log({
        geolocation: currentSelectedAddressDetails.geolocation,
        landmark: currentSelectedAddressDetails.landmark,
        userAddress: currentSelectedAddressDetails.userAddress,
        userCity: currentSelectedAddressDetails.city || "",
        userPinCode: currentSelectedAddressDetails.userPinCode || "",

        butcherInstructions: order.butcherInstructions || "",
        userName: order.userName,
        userPhoneNumber: order.userPhoneNumber,

        userAddressId: currentSelectedAddressDetails.id,
        userId: localStorage.getItem("choose-your-goat-userId"),

        meatRequirements: order.meatRequirements,
        orderType: "chicken",
        orderedDate: new Date().getTime(),
        scheduledDeliveryDate: order.scheduledDeliveryDate,
        totalBill: order.totalBill + deliveryFee,
      });
      const docRef = await addDoc(collection(db, "chickenOrders"), {
        geolocation: currentSelectedAddressDetails.geolocation,
        landmark: currentSelectedAddressDetails.landmark,
        userAddress: currentSelectedAddressDetails.userAddress,
        userCity: currentSelectedAddressDetails.city || "",
        userPinCode: currentSelectedAddressDetails.userPinCode || "",

        butcherInstructions: order.butcherInstructions || "",
        userName: order.userName,
        userPhoneNumber: order.userPhoneNumber,

        userAddressId: currentSelectedAddressDetails.id,
        userId: localStorage.getItem("choose-your-goat-userId"),

        meatRequirements: order.meatRequirements,
        orderType: "chicken",
        orderedDate: new Date().getTime(),
        scheduledDeliveryDate: order.scheduledDeliveryDate,
        totalBill: order.totalBill + deliveryFee,
      });
      console.log(docRef);

      sendEmailOrder(
        currentSelectedAddressDetails.userName,
        // order.userName,
        order.userPhoneNumber,
        currentSelectedAddressDetails.userAddress,
        currentSelectedAddressDetails.landmark,
        order.meatRequirements,
        order.totalBill + deliveryFee,
        order.scheduledDeliveryDate,
        order.orderType,
        order.orderedDate || Date.now()
      );

      setShowConfirmationLoading(false);
      setOrderConfirmation(true);
      return;
    }

    try {
      await runTransaction(db, async (transaction) => {
        // 1. Update goat inventories atomically and place orders
        for (const requirement of order.meatRequirements) {
          const goatRef = doc(db, "goats", requirement.goatId);
          const goatDoc = await transaction.get(goatRef);

          if (!goatDoc.exists()) {
            throw new Error(`Goat with ID ${requirement.goatId} not found.`);
          }

          const goatData = goatDoc.data();

          // Check for availability
          for (const key in requirement) {
            if (key !== "goatId" && requirement[key] !== undefined && mapping[key]) {
              const goatField = mapping[key];
              if (goatData[goatField] < requirement[key]) {
                throw new Error(
                  `Not enough ${goatField} for goat ${requirement.goatId}. Requested: ${requirement[key]}, Available: ${goatData[goatField]}`
                );
              }
            }
          }

          // Prepare the update
          const updateData = {};
          for (const key in requirement) {
            if (key !== "goatId" && mapping[key]) {
              const goatField = mapping[key];
              updateData[goatField] = goatData[goatField] - requirement[key];
            }
          }

          // Apply the update
          transaction.update(goatRef, updateData);

          // Calculate bill
          const goat = goatsData.find((g) => g.docId === requirement.goatId);
          let billCalculated = 0;
          Object.keys(requirement).forEach((requirementKey) => {
            if (requirementKey !== "goatId") {
              const priceKey = priceNames[requirementKey];
              billCalculated +=
                requirement[requirementKey] *
                (goat[localStorage.getItem("true-meat-location")]?.[priceKey] ?? goat["general"]?.[priceKey] ?? goat[priceKey]);
            }
          });

          // Add order (you must use collection().doc() and set to work in a transaction)
          const orderRef = doc(collection(db, "orders"));

          transaction.set(orderRef, {
            ...requirement,
            deliveryDate: goat.deliveryDateTimestamp,
            orderedDate: new Date().getTime(),
            totalBill: billCalculated,

            userAddressId: currentSelectedAddressDetails.id,
            userCity: currentSelectedAddressDetails.city || "",
            userId: localStorage.getItem("choose-your-goat-userId"),

            butcherInstructions: order.butcherInstructions || "",
            userName: order.userName,
            userPhoneNumber: order.userPhoneNumber,

            userAddress: currentSelectedAddressDetails.userAddress || "",
            landmark: currentSelectedAddressDetails.landmark || "",
            pincode: currentSelectedAddressDetails.userPinCode || "",
            geolocation: currentSelectedAddressDetails.geolocation,
          });
        }

        if (getCurrentDay(true) == "Sun") {
          //send remainder mail

          sendEmailOrder(
            // order.userName,
            currentSelectedAddressDetails.userName,
            order.userPhoneNumber,
            currentSelectedAddressDetails.userAddress,
            currentSelectedAddressDetails.landmark,
            order.meatRequirements,
            order.totalBill,
            order.scheduledDeliveryDate ||
              new Date().toLocaleDateString("en-CA", {
                timeZone: "Asia/Kolkata",
              }),
            order.orderType || "mutton",
            order.orderedDate || Date.now()
          );
        }
      });

      // If we reach here, transaction was successful
      setShowConfirmationLoading(false);
      setOrderConfirmation(true);
    } catch (error) {
      setShowConfirmationLoading(false);
      alert("Order failed: " + error.message);
      console.log("Tx error", error);
      console.error("Transaction failed:", error);
    }
  };

  const calculateTotalBill = (requirements, goat) => {
    let totalBill = 0;
    let pincode = localStorage.getItem("true-meat-location");

    Object.keys(requirements).map((requirementKey) => {
      if (requirementKey !== "goatId") {
        const priceKey = priceNames[requirementKey];
        totalBill += requirements[requirementKey] * (goat[pincode]?.[priceKey] ?? goat["general"]?.[priceKey] ?? goat[priceKey]);
      }
    });

    return totalBill;
  };

  const sendOtp = async (e) => {
    setShowSendingOtpLoading(true);
    try {
      const recaptcha = new RecaptchaVerifier(auth, "recaptcha", {
        size: "invisible",
      });

      const confirmation = await signInWithPhoneNumber(auth, "+91 " + order.userPhoneNumber, recaptcha);
      setConfirmation(confirmation);
      setShowSendingOtpLoading(false);
      setShowOtpInputPopup(true);
    } catch (error) {
      console.log(error);
    }
  };

  const verifyOtp = async () => {
    setShowVerificationLoading(true);
    setShowOtpInputPopup(false);
    try {
      const otpValue = otp.join("");
      const otpConfirmation = await confirmation.confirm(otpValue);

      window.localStorage.setItem("choose-your-goat-token", otpConfirmation.user.accessToken);

      setOrder((prev) => ({
        ...prev,
        userId: localStorage.getItem("choose-your-goat-userId"),
      }));

      setShowOtpInputPopup(false);

      let userForNow = addUserToDb(order.userPhoneNumber, otpConfirmation.user.uid, {
        userName: order.userName,
        userPhoneNumber: order.userPhoneNumber,
      });

      localStorage.setItem("choose-your-goat-phoneNumber", order.userPhoneNumber);
      localStorage.setItem("choose-your-goat-userId", userForNow.id);

      addUserAddressToDb({
        userId: otpConfirmation.user.uid,
        userAddress: order.userAddress,
        landmark: order.landmark,
        city: "Sangareddy",
      });

      placeOrder();
    } catch (error) {
      setShowVerificationLoading(false);
      setShowOtpInputPopup(true);
      setShowOtpError(true);
      console.log(error);
    }
  };

  const addUserToDb = async (userPhoneNumber, userId, userData) => {
    try {
      const usersRef = collection(db, "users");

      // 🔍 Search by phone number
      const q = query(usersRef, where("userPhoneNumber", "==", userPhoneNumber));
      const querySnap = await getDocs(q);

      if (!querySnap.empty) {
        // ✅ User exists → update existing doc
        const existingDoc = querySnap.docs[0].ref;
        await updateDoc(existingDoc, userData);
        console.log("User updated successfully");
        return { id: existingDoc.id, ...userData };
      } else {
        // ❌ Not found → create new doc with userId
        const newUserRef = doc(db, "users", userId);
        await setDoc(newUserRef, { ...userData, userPhoneNumber });
        console.log("User created successfully");
        return { id: newUserRef.id, ...userData };
      }
    } catch (error) {
      console.log("Error in creating/updating user", error);
    }
  };

  const addUserAddressToDb = async (userData) => {
    try {
      await addDoc(collection(db, "addresses"), userData);
      console.log("Address doc written");
    } catch (error) {
      console.log("error in setting user address", error);
    }
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d$/.test(value) || value === "") {
      // Update the OTP array
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to the next input if a digit was entered
      if (value !== "" && index < otp?.length - 1) {
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

  // const sendEmailOrder = async (
  //   userName,
  //   userPhoneNumber,
  //   userAddress,
  //   landmark,
  //   meatRequirements,
  //   totalBill
  // ) => {
  //   try {
  //     const serviceID = "service_iw7ipns"; // Replace with your EmailJS service ID
  //     const templateID = "template_cxzybxo"; // Replace with your EmailJS template ID
  //     const publicKey = "omRK8BgK3Wa3-ZxiI"; // Replace with your EmailJS public key

  //     // Template parameters to fill in the email
  //     const templateParams = {
  //       userName,
  //       userPhoneNumber,
  //       userAddress,
  //       landmark,
  //       meatRequirements,
  //       totalBill,
  //     };

  //     const response = await emailjs.send(
  //       serviceID,
  //       templateID,
  //       templateParams,
  //       publicKey
  //     );
  //     console.log("Email sent successfully:", response.status, response.text);
  //     return { success: true, message: "Email sent successfully" };
  //   } catch (error) {
  //     console.error("Failed to send email:", error);
  //     return { success: false, message: "Failed to send email", error };
  //   }
  // };

  const sendEmailOrder = async (
    userName,
    userPhoneNumber,
    userAddress,
    landmark,
    meatRequirements,
    totalBill,
    scheduledDeliveryDate,
    orderType,
    orderedDate
  ) => {
    try {
      const resp = await axios.post("https://sendneworderemail-ypvdab2dka-uc.a.run.app", {
        // const resp = await axios.post("http://127.0.0.1:5001/choose-your-goat/us-central1/sendNewOrderEmail", {
        userName: userName,
        userPhoneNumber: userPhoneNumber,
        userAddress: userAddress,
        landmark: landmark,
        meatRequirements: meatRequirements,
        totalBill: totalBill,
        scheduledDeliveryDate: scheduledDeliveryDate,
        orderType: orderType,
        orderedDate: orderedDate,
      });
      console.log("Email sent successfully", resp);
    } catch (error) {
      console.log("error in sending order email");
      console.log(error);
    }
  };

  useEffect(() => {
    if (order.meatRequirements?.length <= 0) {
      window.location.href = "/";
    }

    console.log("goatsData in cart", goatsData);
    console.log("Orders in cart", order);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.backBar}>
          <div
            className={styles.backBtn}
            onClick={() => {
              if (createNewAddress) {
                setCreateNewAddress(false);
              } else {
                order.orderType === "chicken" ? navigate("/chicken") : navigate("/mutton");
              }
            }}
          >
            <i>
              <LuMoveLeft size={20} />
            </i>
            <p>Back</p>
          </div>
        </div>
        <div className={styles.carts}>
          {order.orderType === "chicken"
            ? order.meatRequirements.map((item, index) => {
                const henData = hensData.find((hen) => hen.docId === item.henId);
                const totalPrice = henData ? henData.chickenPrice * item.quantity : 0;

                return (
                  <div className={styles.cartItemsWrap}>
                    <div className={styles.cartItem} key={index}>
                      <div className={styles.priceValues}>
                        <p>
                          {item?.henName} {`(${item.quantity})`}
                        </p>
                      </div>
                      <p>₹ {totalPrice}/-</p>
                    </div>
                  </div>
                );
              })
            : order.meatRequirements.map((goatObj, index) => (
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
                            {/* {goatObj[keyName] *
                              (goatsData.find((item) => item.docId === goatObj.goatId)
                                ? goatsData.find((item) => item.docId === goatObj.goatId)[localStorage.getItem("true-meat-location")]?.[
                                    priceNames[keyName]
                                  ] ??
                                  goatsData.find((item) => item.docId === goatObj.goatId)["general"]?.[priceNames[keyName]] ??
                                  goatsData.find((item) => item.docId === goatObj.goatId)[priceNames[keyName]]
                                : 0)} */}
                            {(() => {
                              const goatCount = goatObj[keyName];
                              const goat = goatsData.find((item) => item.docId === goatObj.goatId);
                              const pincode = localStorage.getItem("true-meat-location");
                              const priceKey = priceNames[keyName];

                              if (!goat) return 0;

                              const price = goat[pincode]?.[priceKey] ?? goat["general"]?.[priceKey] ?? goat[priceKey];

                              return goatCount * price;
                            })()}
                            /-
                          </p>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              ))}

          <div className="w-full">
            {order.orderType === "chicken" && (
              <div className=" w-full divide-y divide-gray-200 px-4 dark:divide-gray-800">
                <dl className="flex items-center justify-between gap-4">
                  <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Delivery fee</dt>
                  <dd className="text-base font-medium text-gray-900 dark:text-white">₹ 20/-</dd>
                </dl>
              </div>
            )}

            <div className=" w-full divide-y divide-gray-200 px-4 dark:divide-gray-800">
              <dl className="flex items-center justify-between gap-4 py-3">
                <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Subtotal</dt>
                <dd className="text-base font-medium text-gray-900 dark:text-white">
                  ₹{order.orderType === "chicken" ? order.totalBill + 20 : order.totalBill}
                  /-
                  {/* ₹ {order.totalBill + 20}/- */}
                </dd>
              </dl>
            </div>
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

        {!createNewAddress && (
          <SelectAddress
            selectedAddressId={selectedAddressId}
            setSelectedAddressId={setSelectedAddressId}
            setCreateNewAddress={setCreateNewAddress}
            placeOrder={placeOrder}
          />
        )}
        {createNewAddress && <CheckOutForm sendOtp={sendOtp} placeOrder={placeOrder} />}
      </div>

      {/* <div className={styles.form}>
        <button onClick={sendOtp}>Send OTP</button>
        <div id="recaptcha"></div>
        <button onClick={verifyOtp}>Verify OTP</button>
      </div> */}

      {showSendingOtpLoading && (
        <div className={styles.verifyOtpContainer}>
          <div className={styles.loader}></div>

          <h6>Sending OTP to your phone number</h6>
        </div>
      )}

      {showOtpInputPopup && (
        <div className={styles.verifyOtpContainer}>
          <h6>Verify your mobile number</h6>
          <div className={styles.otpInputContainer}>
            {otp.map((digit, index) => (
              <input
                key={index}
                type="number"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
                inputMode="numeric"
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
        <div className={styles.overlay}>
          <button
            className={styles.backButton}
            onClick={() => {
              setOrderConfirmation(false);

              if (order.orderType === "chicken") {
                navigate("/chicken");
              } else {
                navigate("/mutton");
              }
            }} // close logic
          >
            ← Back
          </button>

          <div className={styles.verifyOtpContainer}>
            <div className={styles.popupContent}>
              <div className={styles.checkmark}>
                <SiTicktick color="#1D1E22" size={40} />
              </div>
              <h1>Your order is confirmed!</h1>
              <p>Thank you for your order</p>
              <button className={styles.goHomeBtn} onClick={() => (window.location.href = "/orders")}>
                My Orders
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
