import React, { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Catalog from "./components/Meat Catalog/Catalog";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Cart from "./components/Meat Catalog/Cart/Cart";
import { GiPschentDoubleCrown } from "react-icons/gi";

const order = {
  meatRequirements: [
    {
      goatId: "",
      numberOfMuttonShares: "",
      numberOfHeadLegsBrainShares: "",
      numberOfHeadShares: "",
      numberOfLegsShares: "",
      numberOfBrainShares: "",
      numberOfBotiShares: "",
      numberOfExtras: "",
    },
  ],
  cutomerName: "",
  customerPhoneNumber: "",
  gpsLocation: "",
};

const App = () => {
  const [goatsData, setGoatsData] = useState([]);
  return (
    <div className="appContainer">
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/" index element={<Catalog />} />
          <Route path="cart" element={<Cart />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
