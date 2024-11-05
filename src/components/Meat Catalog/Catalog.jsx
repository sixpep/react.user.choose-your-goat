import React, { useEffect, useState } from "react";
import styles from "./Catalog.module.css";
import { io } from "socket.io-client";
import CheckOutForm from "./Check Out Form/CheckOutForm";
import TileCarousel from "./Carousel/TileCarousel";

const socket = io("http://localhost:3000");

const Catalog = () => {
  const [goatsData, setGoatsData] = useState([]);
  const [order, setOrder] = useState({
    meatRequirements: [],
    totalBill: 0,
  });
  const [showCheckOutForm, setShowCheckOutForm] = useState(false);

  useEffect(() => {
    socket.on("goatsData", (data) => {
      console.log("Data coming from socket ", data);
      const tempData = [...data, sampleItem];
      console.log("tempData", tempData);
      setGoatsData(tempData);
    });

    return () => {
      socket.off("goatsData");
    };
  }, []);

  const sampleItem = {
    docId: "sampleDoc123",
    goatImage: "/images/goat1.jpeg",
    gender: "Male",
    netWeight: 30,
    meatOnlyWeight: 25,
    totalShares: 100,
    approxShareSize: 250,
    perShareCost: 500,
    cutSize: "Medium",
    headLegsBrainPrice: 200,
    headPrice: 100,
    legsPrice: 100,
    brainPrice: 80,
    botiShareCost: 150,
    extraCost: 50,
    deliveryDateTimestamp: Date.now(),
    totalBotiShares: 20,
    remainingBotiShares: 15,
    headLegsBrainAvailability: true,
    headAvailability: true,
    brainAvailability: true,
    legsAvailability: true,
    remainingShares: 40,
    remainingExtraShares: 5,
  };

  return (
    <div className={styles.container}>
      <TileCarousel goatsData={goatsData} order={order} setOrder={setOrder} />
      <div className={styles.checkOutWrap}>
        <p>
          Total : <span> ₹ {order.totalBill}</span>
        </p>
        <button onClick={() => (window.location.href = "/cart")}>
          View Cart
        </button>
      </div>
      {showCheckOutForm && (
        <div className={styles.checkOutForm}>
          <CheckOutForm setShowCheckOutForm={setShowCheckOutForm} />
        </div>
      )}
    </div>
  );
};

export default Catalog;
