import React, { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Catalog from "./components/Meat Catalog/Catalog";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Cart from "./components/Meat Catalog/Cart/Cart";
import { db } from "../src/firebase/setup";
import { collection, doc, getDoc, getDocs, onSnapshot, query, where, orderBy, limit } from "firebase/firestore";
import { jwtDecode } from "jwt-decode";
import UserOrders from "./components/UserOrders/UserOrders";
import LoginPage from "./components/LoginPage/LoginPage";
import Homepage from "./components/Homepage/Homepage";
import ChickenPage from "./components/ChickenPage/ChickenPage";
import EggsPage from "./components/ChickenPage/EggsPage";
import PopupModal from "./components/Modals/PopupModal";
import { getTokenFromQuery } from "./utils/extractQuery.utils";
import UserProfile from "./components/UserProfilePage/UserProfile";

export const Context = React.createContext();

const App = () => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [selectLocationPopup, setSelectLocationPopup] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [goatsData, setGoatsData] = useState([]);
  const [hensData, setHensData] = useState([]);
  const [eggsData, setEggsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [order, setOrder] = useState({
    meatRequirements: [],
    userId: "",
    userName: "",
    userPhoneNumber: "",
    userAddress: "",
    landmark: "",
    geolocation: { latitude: "", longitude: "" },
    referralCode: "",
    referredById: "",
    totalBill: 0,
  });
  const [pincodes, setPincodes] = useState([]);

  async function getDuplicatePhoneNumbers() {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const phoneCountMap = {};

      querySnapshot.forEach((doc) => {
        const phone = doc.data().userPhoneNumber;
        if (phone) {
          phoneCountMap[phone] = (phoneCountMap[phone] || 0) + 1;
        }
      });

      const duplicates = Object.entries(phoneCountMap)
        .filter(([phone, count]) => count > 1)
        .map(([phone]) => phone);

      return duplicates;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  }

  const getUser = async (phoneNumber) => {
    try {
      localStorage.setItem("choose-your-goat-phoneNumber", phoneNumber);
      const userRef = query(collection(db, "users"), where("userPhoneNumber", "==", phoneNumber), limit(1));

      const userSnap = await getDocs(userRef);

      console.log("userSnap");
      console.log(userSnap);

      let usersData = [];

      if (!userSnap.empty) {
        userSnap.forEach((doc) => {
          usersData.push({ userId: doc.id, ...doc.data() });
        });
        usersData = usersData[0];
        localStorage.setItem("choose-your-goat-userId", usersData.userId);

        return usersData;
      } else {
        // Handle the case: no document found
        localStorage.removeItem("choose-your-goat-token");
        localStorage.removeItem("choose-your-goat-userId");
        alert("user not found");
      }
    } catch (error) {
      return error;
    }
  };

  const getUserAddress = async (userId) => {
    try {
      const addresses = [];
      const addressesQuery = await getDocs(query(collection(db, "addresses"), where("userId", "==", userId)));

      addressesQuery.docs.forEach((doc) => {
        addresses.push({
          id: doc.id, // ✅ include document ID
          ...doc.data(), // ✅ spread the address data
        });
      });

      return addresses;
    } catch (error) {
      return error;
    }
  };

  async function getPincodes() {
    try {
      let pincodes = await getDocs(collection(db, "availability"));
      let result = [];
      pincodes.forEach((doc) => {
        result.push(doc.data().pincode);
      });
      return result;
    } catch (error) {
      return error;
    }
  }

  const fetchUserData = async () => {
    const userToken = localStorage.getItem("choose-your-goat-token");

    if (userToken) {
      try {
        const decodedToken = jwtDecode(userToken);
        // console.log("decodedToken");
        // console.log(decodedToken);

        let phoneNumber = decodedToken.phone_number;
        phoneNumber = phoneNumber.replace(/^(\+91)/, "");
        // console.log(phoneNumber);

        // const user = await getUser(decodedToken.sub);
        const user = await getUser(phoneNumber);

        // console.log("await getDuplicatePhoneNumbers()");
        // console.log(await getDuplicatePhoneNumbers());

        // console.log("User data");
        // console.log(user);

        const userAddress = await getUserAddress(user.userId);

        setOrder((prev) => ({
          ...prev,
          userId: user.userId,
          userPhoneNumber: user?.userPhoneNumber,
          userName: user?.userName,
          userAddress: userAddress[0]?.userAddress,
          landmark: userAddress[0]?.landmark,
          userAddressesList: userAddress,
          referralCode: user.referralCode,
          referredById: user.referredById,
        }));
      } catch (error) {
        console.log("no token");
        alert("no token");
        localStorage.removeItem("choose-your-goat-token");
        localStorage.removeItem("choose-your-goat-userId");
        console.error("Failed to fetch user:", error);
      }
    }
  };

  useEffect(() => {
    let tempToken = getTokenFromQuery(window.location.search);

    // console.log("tempToken");
    // console.log(tempToken);

    if (tempToken) {
      localStorage.removeItem("choose-your-goat-token");
      localStorage.removeItem("choose-your-goat-userId");

      localStorage.setItem("choose-your-goat-token", tempToken);
    }

    setIsLoading(true);
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

    const unsubscribeEggs = onSnapshot(collection(db, "eggs"), (snapshot) => {
      const updatedEggsData = snapshot.docs.map((doc) => ({
        docId: doc.id,
        ...doc.data(),
      }));

      updatedEggsData.sort((a, b) => b.deliveryDateTimestamp - a.deliveryDateTimestamp);

      console.log("Updated Eggs Data", updatedEggsData);
      setEggsData(updatedEggsData);
    });

    fetchUserData();

    // for location popup

    //get pincodes from db
    const fetchPincodes = async () => {
      const pincodesArr = await getPincodes();
      setPincodes(pincodesArr);
      setIsLoading(false);
    };
    fetchPincodes();
    setLocationName(localStorage.getItem("true-meat-location"));

    if (localStorage.getItem("true-meat-location")?.length == 0 || !localStorage.getItem("true-meat-location")?.length) {
      setSelectLocationPopup(true);
    }

    // Cleanup function to unsubscribe from snapshots
    return () => {
      unsubscribeGoats();
      unsubscribeHens();
      unsubscribeEggs();
    };
  }, []);

  const closePopup = () => {
    setSelectLocationPopup(false);
  };

  return (
    <Context.Provider value={{ order, setOrder, goatsData, setGoatsData, hensData, eggsData }}>
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
            <Route path="/login" element={<LoginPage fetchUserData={fetchUserData} />} />
            <Route path="/mutton" element={<Catalog />} />
            <Route path="/chicken" element={<ChickenPage />} />
            <Route path="/egg" element={<EggsPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<UserOrders />} />
            <Route path="/profile" element={<UserProfile />} />
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
                {console.log(pincodes)}
                {pincodes?.map((pinCode, index) => (
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
        {isLoading && (
          <div className="loading-overlay">
            <div className="spinner" />
          </div>
        )}
      </div>
    </Context.Provider>
  );
};

export default App;
