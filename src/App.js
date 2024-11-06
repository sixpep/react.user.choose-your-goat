import React, { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Catalog from "./components/Meat Catalog/Catalog";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Cart from "./components/Meat Catalog/Cart/Cart";

export const Context = React.createContext();

const App = () => {
  const [goatsData, setGoatsData] = useState([]);
  const [order, setOrder] = useState({
    meatRequirements: [],
    customerName: "",
    customerPhoneNumber: "",
    gpsLocation: "",
  });

  useEffect(() => {
    order.meatRequirements.map((item) => console.log(item));
    console.log(".".repeat(20));
  }, [order]);

  return (
    <Context.Provider value={{ order, setOrder }}>
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

// const order = {
//   meatRequirements: [
//     {
//       goatId: "",
//       numberOfMuttonShares: "",
//       numberOfHeadLegsBrainShares: "",
//       numberOfHeadShares: "",
//       numberOfLegsShares: "",
//       numberOfBrainShares: "",
//       numberOfBotiShares: "",
//       numberOfExtras: "",
//     },
//   ],
//   cutomerName: "",
//   customerPhoneNumber: "",
//   gpsLocation: "",
// };
