import React, { useEffect, useState } from "react";
import "./App.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase/setup";

import LocationModal from "./components/LocationModal";
import Homepage from "./components/Homepage/Homepage";
import ChickenPage from "./components/ChickenPage/ChickenPage";
import CartPage from "./components/CartPage/CartPage";
import SelectAddressPage from "./components/Address/SelectAddressPage";
import AddAddressPage from "./components/Address/AddAddressPage";
import EditAddressPage from "./components/Address/EditAddressPage";
import UserOrders from "./components/UserOrders/UserOrders";

export const Context = React.createContext();

const App = () => {
  // 🔹 Location state
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [locationMeta, setLocationMeta] = useState(null);

  // 🔹 Modal & UI state
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [locationConfirmedUI, setLocationConfirmedUI] = useState(false);

  // 🔹 Splash state
  const [showSplash, setShowSplash] = useState(true);

  // 🔹 Cart state (shared across app)
  const [cart, setCart] = useState({ items: [] });

  // dummy userId for now (later replace with real auth)
  const [userId] = useState(() => {
    const stored = localStorage.getItem("userId");
    if (stored) return stored;
    const dummy = "test-user-1";
    localStorage.setItem("userId", dummy);
    return dummy;
  });

  const [userProfile] = useState({
    name: "Test User", // later: from your login/user fetch
    phone: "9999999999", // later: from real user
  });

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
        setLocationMeta(null);
        setIsLocationModalOpen(true);
      } else {
        const locInfo = await verifyLocation(stored);

        if (!locInfo) {
          localStorage.removeItem("deliveryPincode");
          setDeliveryLocation(null);
          setLocationMeta(null);
          setIsLocationModalOpen(true);
          setLocationError("We no longer deliver to this location. Please choose another.");
        } else {
          setDeliveryLocation(locInfo.pincode);
          setLocationMeta(locInfo);
          setIsLocationModalOpen(false);
          setLocationError("");
        }
      }

      // ensure splash shows at least 2s
      const elapsed = Date.now() - start;
      const minimum = 2000;
      const remaining = Math.max(0, minimum - elapsed);
      setTimeout(() => setShowSplash(false), remaining);
    };

    initLocation();
  }, []);

  // ───────────────────────────
  //  Cart logic (shared)
  // ───────────────────────────

  // init cart from localStorage once
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      if (parsed && Array.isArray(parsed.items)) {
        setCart(parsed);
      }
    } catch (e) {
      console.error("Failed to parse cart from localStorage", e);
    }
  }, []);

  // sync cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // item must have: type, skuId, title, pricePerUnit, quantity
  const addToCart = (item) => {
    setCart((prev) => {
      const items = [...prev.items];

      const index = items.findIndex((i) => i.type === item.type && i.skuId === item.skuId);

      if (index !== -1) {
        const newQty = (items[index].quantity || 0) + (item.quantity || 0 || 1);
        const updated = {
          ...items[index],
          quantity: newQty,
          totalPrice: newQty * items[index].pricePerUnit,
        };
        items[index] = updated;
      } else {
        const quantity = item.quantity || 1;
        items.push({
          ...item,
          quantity,
          totalPrice: quantity * item.pricePerUnit,
        });
      }

      return { ...prev, items };
    });
  };

  const updateCartItemQuantity = (type, skuId, quantity) => {
    setCart((prev) => {
      const items = [...prev.items];
      const index = items.findIndex((i) => i.type === type && i.skuId === skuId);

      if (index === -1) return prev;

      if (quantity <= 0) {
        // remove line item if quantity becomes 0
        items.splice(index, 1);
      } else {
        items[index] = {
          ...items[index],
          quantity,
          totalPrice: quantity * items[index].pricePerUnit,
        };
      }

      return { ...prev, items };
    });
  };

  // predicate is a function that receives an item and returns true if it should be removed
  const removeFromCart = (predicate) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.filter((item) => !predicate(item)),
    }));
  };

  const clearCart = () => {
    setCart({ items: [] });
  };

  // total count = sum of quantities
  const cartCount = cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const cartTotal = cart.items.reduce((sum, item) => sum + (item.totalPrice || item.pricePerUnit * (item.quantity || 0)), 0);

  // ───────────────────────────
  //  Splash screen
  // ───────────────────────────

  if (showSplash) {
    return (
      <div className="appContainer">
        <div className="splashScreen splashBlack">
          <img
            src="/logo-white.png" // your white logo on black background
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
        cart,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
        userId,
        userProfile,
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
            <Route path="/chicken" element={<ChickenPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/select-address" element={<SelectAddressPage />} />
            <Route path="/add-address" element={<AddAddressPage />} />
            <Route path="/edit-address/:addressId" element={<EditAddressPage />} />
            <Route path="/orders" element={<UserOrders />} />
            {/* later: /mutton, /chicken, /egg, /cart, /orders, /login */}
          </Routes>
        </BrowserRouter>
      </div>
    </Context.Provider>
  );
};

export default App;
