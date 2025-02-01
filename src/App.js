import React, { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Catalog from "./components/Meat Catalog/Catalog";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Cart from "./components/Meat Catalog/Cart/Cart";
import { db } from "../src/components/firebase/setup";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { jwtDecode } from "jwt-decode";
import UserOrders from "./components/UserOrders/UserOrders";
import LoginPage from "./components/LoginPage/LoginPage";
import Homepage from "./components/Homepage/Homepage";
import ChickenPage from "./components/ChickenPage/ChickenPage";
import PopupModal from "./components/Modals/PopupModal";

export const Context = React.createContext();

const App = () => {
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
    const unsubscribeGoats = onSnapshot(collection(db, "goats"), (snapshot) => {
      const updatedGoatsData = snapshot.docs.map((doc) => ({
        docId: doc.id,
        ...doc.data(),
      }));

      updatedGoatsData.sort(
        (a, b) => b.deliveryDateTimestamp - a.deliveryDateTimestamp
      );

      console.log("Updated Goats Data", updatedGoatsData);
      setGoatsData(updatedGoatsData);
    });

    const unsubscribeHens = onSnapshot(collection(db, "hens"), (snapshot) => {
      const updatedHensData = snapshot.docs.map((doc) => ({
        docId: doc.id,
        ...doc.data(),
      }));

      updatedHensData.sort(
        (a, b) => b.deliveryDateTimestamp - a.deliveryDateTimestamp
      );

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

    // Cleanup function to unsubscribe from snapshots
    return () => {
      unsubscribeGoats();
      unsubscribeHens();
    };
  }, []);

  return (
    <Context.Provider
      value={{ order, setOrder, goatsData, setGoatsData, hensData }}
    >
      <div className="appContainer">
        <Navbar />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to={"/home"} />} />
            <Route path="/home" index element={<Homepage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/mutton" element={<Catalog />} />
            <Route path="/chicken" element={<ChickenPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<UserOrders />} />
          </Routes>
        </BrowserRouter>
      </div>
    </Context.Provider>
  );
};

export default App;
