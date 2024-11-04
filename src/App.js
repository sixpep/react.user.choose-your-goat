import React from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Catalog from "./components/Meat Catalog/Catalog";


const App = () => {
  return (
    <div className="appContainer">
      <Navbar />
      <Catalog />
    </div>
  );
};

export default App;
