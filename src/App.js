import React, { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Catalog from "./components/Meat Catalog/Catalog";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Cart from "./components/Meat Catalog/Cart/Cart";
import { db } from "../src/firebase/setup";
import { collection, doc, getDoc, getDocs, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { jwtDecode } from "jwt-decode";
import UserOrders from "./components/UserOrders/UserOrders";
import LoginPage from "./components/LoginPage/LoginPage";
import Homepage from "./components/Homepage/Homepage";
import ChickenPage from "./components/ChickenPage/ChickenPage";
import { pincodes } from "./staticValues";
import PopupModal from "./components/Modals/PopupModal";

export const Context = React.createContext();

const App = () => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [selectLocationPopup, setSelectLocationPopup] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [goatsData, setGoatsData] = useState([]);
  const [hensData, setHensData] = useState([]);
  const [order, setOrder] = useState({
    meatRequirements: [],
    userId: "",
    userName: "",
    userPhoneNumber: "",
    userAddress: "",
    landmark: "",
    gpsLocation: "",
    totalBill: 0,
  });

  const getUser = async (userId) => {
    try {
      const userDoc = (await getDoc(doc(db, "users", userId))).data();
      return userDoc;
    } catch (error) {
      return error;
    }
  };

  const getUserAddress = async (userId) => {
    try {
      const addresses = [];
      const addressesQuery = await getDocs(collection(db, "addresses"));
      addressesQuery.forEach((doc) => {
        addresses.push(doc.data());
      });

      const addressDoc = addresses.filter((item) => item.userId === userId);
      return addressDoc;
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    const unsubscribeGoats = onSnapshot(query(collection(db, "goats"), orderBy("deliveryDateTimestamp", "desc"), limit(3)), (snapshot) => {
      const updatedGoatsData = snapshot.docs.map((doc) => ({
        docId: doc.id,
        ...doc.data(),
      }));

      //updatedGoatsData.sort((a, b) => b.deliveryDateTimestamp - a.deliveryDateTimestamp);

      console.log("Updated Goats Data", updatedGoatsData);
      setGoatsData(updatedGoatsData);
    });

    const unsubscribeHens = onSnapshot(collection(db, "hens"), (snapshot) => {
      const updatedHensData = snapshot.docs.map((doc) => ({
        docId: doc.id,
        ...doc.data(),
      }));

      updatedHensData.sort((a, b) => b.deliveryDateTimestamp - a.deliveryDateTimestamp);

      console.log("Updated Hens Data", updatedHensData);
      setHensData(updatedHensData);
    });

    const fetchUserData = async () => {
      const userToken = localStorage.getItem("choose-your-goat-token");

      if (userToken) {
        try {
          const decodedToken = jwtDecode(userToken);
          const user = await getUser(decodedToken.sub);
          const userAddress = await getUserAddress(decodedToken.sub);

          setOrder((prev) => ({
            ...prev,
            userId: decodedToken.sub,
            userPhoneNumber: user?.userPhoneNumber,
            userName: user?.userName,
            userAddress: userAddress[0]?.userAddress,
            landmark: userAddress[0]?.landmark,
          }));
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      }
    };

    fetchUserData();

    // for location popup

    setLocationName(localStorage.getItem("true-meat-location"));

    if (localStorage.getItem("true-meat-location")?.length == 0 || !localStorage.getItem("true-meat-location")?.length) {
      setSelectLocationPopup(true);
    }

    // Cleanup function to unsubscribe from snapshots
    return () => {
      unsubscribeGoats();
      unsubscribeHens();
    };
  }, []);

  const closePopup = () => {
    setSelectLocationPopup(false);
  };

  return (
    <Context.Provider value={{ order, setOrder, goatsData, setGoatsData, hensData }}>
      <div className="appContainer">
        <Navbar selectLocationPopup={selectLocationPopup} setSelectLocationPopup={setSelectLocationPopup} locationName={locationName} />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to={"/home"} />} />
            <Route
              path="/home"
              index
              element={
                <Homepage
                  // selectLocationPopup={selectLocationPopup}
                  // setSelectLocationPopup={setSelectLocationPopup}
                  // setLocationName={setLocationName}
                  // locationName={locationName}
                  isPopupVisible={isPopupVisible}
                  setPopupVisible={setPopupVisible}
                />
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/mutton" element={<Catalog />} />
            <Route path="/chicken" element={<ChickenPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<UserOrders />} />
          </Routes>
        </BrowserRouter>
        {!isPopupVisible && selectLocationPopup && (
          <div className="popup">
            <div className="popupContent">
              <label htmlFor="userAddress" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                Pin Code*{" "}
              </label>
              <select
                id="userPinCode"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                value={locationName}
                onChange={(e) => {
                  setLocationName(e.target.value);
                  localStorage.setItem("true-meat-location", e.target.value);
                  if (e.target.value?.length > 0) {
                    setSelectLocationPopup(false);
                    window.location.href = "/home";
                  }
                }}
              >
                <option key={0} value="">
                  Select Pincode
                </option>
                {pincodes.map((pinCode, index) => (
                  <option key={index + 1} value={pinCode}>
                    {pinCode}
                  </option>
                ))}
              </select>
              {localStorage.getItem("true-meat-location") && (
                <button className="closeButton" onClick={closePopup}>
                  Close
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </Context.Provider>
  );
};

export default App;
