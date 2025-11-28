import React, { useEffect, useState } from "react";
import "./App.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase/setup";

import LocationModal from "./components/LocationModal";
import Homepage from "./components/Homepage/Homepage";

export const Context = React.createContext();

const App = () => {
  // 🔹 Location state
  const [deliveryLocation, setDeliveryLocation] = useState(null); // pincode
  const [locationMeta, setLocationMeta] = useState(null); // { pincode, areas, allowMuttonOrders, ... }

  // 🔹 Modal & UI state
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [locationConfirmedUI, setLocationConfirmedUI] = useState(false);

  // 🔹 Splash screen state
  const [showSplash, setShowSplash] = useState(true);

  // ───────────────────────────
  //  Location / Pincode logic
  // ───────────────────────────

  const verifyLocation = async (pincode) => {
    try {
      const q = query(collection(db, "delivery-locations"), where("pincode", "==", pincode));
      const snapshot = await getDocs(q);

      if (snapshot.empty) return null;

      const doc = snapshot.docs[0].data();

      return {
        pincode,
        areas: doc.areas,
        allowMuttonOrders: doc.allowMuttonOrders ?? false,
        allowChickenOrders: doc.allowChickenOrders ?? false,
        allowEggOrders: doc.allowEggOrders ?? false,
      };
    } catch (err) {
      console.error("Error verifying location:", err);
      return null;
    }
  };

  const handleConfirmLocation = async (pincode) => {
    setLocationError("");

    const locInfo = await verifyLocation(pincode);

    if (!locInfo) {
      setLocationError("Sorry, we don't deliver to this location yet.");
      return;
    }

    setDeliveryLocation(locInfo.pincode);
    setLocationMeta(locInfo);
    localStorage.setItem("deliveryPincode", locInfo.pincode);

    setLocationConfirmedUI(true);
  };

  const handleLocationContinue = () => {
    setIsLocationModalOpen(false);
    setLocationConfirmedUI(false);
    setLocationError("");
  };

  const openLocationModal = () => {
    setLocationError("");
    setLocationConfirmedUI(false);
    setIsLocationModalOpen(true);
  };

  useEffect(() => {
    const initLocation = async () => {
      const start = Date.now();
      const stored = localStorage.getItem("deliveryPincode");

      if (!stored) {
        // No saved pincode → ask user
        setLocationMeta(null);
        setIsLocationModalOpen(true);
      } else {
        // Re-verify stored pincode and get flags
        const locInfo = await verifyLocation(stored);

        if (!locInfo) {
          // Pincode no longer serviceable → reset and ask again
          localStorage.removeItem("deliveryPincode");
          setDeliveryLocation(null);
          setLocationMeta(null);
          setIsLocationModalOpen(true);
          setLocationError("We no longer deliver to this location. Please choose another.");
        } else {
          // Still valid → hydrate state and continue silently
          setDeliveryLocation(locInfo.pincode);
          setLocationMeta(locInfo);
          setIsLocationModalOpen(false);
          setLocationError("");
        }
      }

      // 🔹 Ensure splash shows for at least 2 seconds
      const elapsed = Date.now() - start;
      const minimum = 2000; // 2 seconds
      const remaining = Math.max(0, minimum - elapsed);

      setTimeout(() => {
        setShowSplash(false);
      }, remaining);
    };

    initLocation();
  }, []);

  // 🔹 Splash screen: full black with logo
  if (showSplash) {
    return (
      <div className="appContainer">
        <div className="splashScreen">
          <img
            src="/logo-white.png" // make sure this path is correct
            alt="True Meat"
            className="splashLogo"
          />
        </div>
      </div>
    );
  }

  return (
    <Context.Provider
      value={{
        deliveryLocation,
        locationMeta,
        openLocationModal,
      }}
    >
      <div className="appContainer fadeIn">
        {isLocationModalOpen && (
          <LocationModal onConfirm={handleConfirmLocation} error={locationError} isConfirmed={locationConfirmedUI} onContinue={handleLocationContinue} pincode={deliveryLocation} />
        )}

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Homepage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </Context.Provider>
  );
};

export default App;
