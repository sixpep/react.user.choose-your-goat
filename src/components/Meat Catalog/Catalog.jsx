import React, { useEffect, useState } from "react";
import styles from "./Catalog.module.css";
import Tile from "./Tile Component/Tile";
import { io } from "socket.io-client";
import CheckOutForm from "./Check Out Form/CheckOutForm";

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
      console.log(data);
      setGoatsData(data);
    });

    return () => {
      socket.off("goatsData");
    };
  }, []);

  const sampleItem = {
    docId: "sampleDoc123",
    goatImage: "/images/goat1.jpeg", // Placeholder image URL
    gender: "Male",
    netWeight: 30,
    meatOnlyWeight: 25,
    totalShares: 100,
    approxShareSize: 250, // in grams
    perShareCost: 500, // example cost per share
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
      {goatsData?.map((item, index) => {
        return (
          <Tile
            key={index}
            docId={item.docId}
            goatImage={item.goatImage}
            gender={item.gender}
            netWeight={item.netWeight}
            meatOnlyWeight={item.meatOnlyWeight}
            totalShares={item.totalShares}
            approxShareSize={item.approxShareSize}
            perShareCost={item.perShareCost}
            cutSize={item.cutSize}
            headLegsBrainPrice={item.headLegsBrainPrice}
            headPrice={item.headPrice}
            legsPrice={item.legsPrice}
            brainPrice={item.brainPrice}
            botiShareCost={item.botiShareCost}
            extraCost={item.extraCost}
            deliveryDateTimestamp={item.deliveryDateTimestamp}
            totalBotiShares={item.totalBotiShares}
            remainingBotiShares={item.remainingBotiShares}
            headLegsBrainAvailability={item.headLegsBrainAvailability}
            headAvailability={item.headAvailability}
            brainAvailability={item.brainAvailability}
            legsAvailability={item.legsAvailability}
            remainingShares={item.remainingShares}
            remainingExtraShares={item.remainingExtraShares}
            order={order}
            setOrder={setOrder}
          />
        );
      })}
      <Tile
        key={sampleItem.docId}
        docId={sampleItem.docId}
        goatImage={sampleItem.goatImage}
        gender={sampleItem.gender}
        netWeight={sampleItem.netWeight}
        meatOnlyWeight={sampleItem.meatOnlyWeight}
        totalShares={sampleItem.totalShares}
        approxShareSize={sampleItem.approxShareSize}
        perShareCost={sampleItem.perShareCost}
        cutSize={sampleItem.cutSize}
        headLegsBrainPrice={sampleItem.headLegsBrainPrice}
        headPrice={sampleItem.headPrice}
        legsPrice={sampleItem.legsPrice}
        brainPrice={sampleItem.brainPrice}
        botiShareCost={sampleItem.botiShareCost}
        extraCost={sampleItem.extraCost}
        deliveryDateTimestamp={sampleItem.deliveryDateTimestamp}
        totalBotiShares={sampleItem.totalBotiShares}
        remainingBotiShares={sampleItem.remainingBotiShares}
        headLegsBrainAvailability={sampleItem.headLegsBrainAvailability}
        headAvailability={sampleItem.headAvailability}
        brainAvailability={sampleItem.brainAvailability}
        legsAvailability={sampleItem.legsAvailability}
        remainingShares={sampleItem.remainingShares}
        remainingExtraShares={sampleItem.remainingExtraShares}
        order={order}
        setOrder={setOrder}
      />
      <Tile
        key={sampleItem.docId}
        docId={sampleItem.docId}
        goatImage={sampleItem.goatImage}
        gender={sampleItem.gender}
        netWeight={sampleItem.netWeight}
        meatOnlyWeight={sampleItem.meatOnlyWeight}
        totalShares={sampleItem.totalShares}
        approxShareSize={sampleItem.approxShareSize}
        perShareCost={sampleItem.perShareCost}
        cutSize={sampleItem.cutSize}
        headLegsBrainPrice={sampleItem.headLegsBrainPrice}
        headPrice={sampleItem.headPrice}
        legsPrice={sampleItem.legsPrice}
        brainPrice={sampleItem.brainPrice}
        botiShareCost={sampleItem.botiShareCost}
        extraCost={sampleItem.extraCost}
        deliveryDateTimestamp={sampleItem.deliveryDateTimestamp}
        totalBotiShares={sampleItem.totalBotiShares}
        remainingBotiShares={sampleItem.remainingBotiShares}
        headLegsBrainAvailability={sampleItem.headLegsBrainAvailability}
        headAvailability={sampleItem.headAvailability}
        brainAvailability={sampleItem.brainAvailability}
        legsAvailability={sampleItem.legsAvailability}
        remainingShares={sampleItem.remainingShares}
        remainingExtraShares={sampleItem.remainingExtraShares}
        order={order}
        setOrder={setOrder}
      />
      <Tile
        key={sampleItem.docId}
        docId={sampleItem.docId}
        goatImage={sampleItem.goatImage}
        gender={sampleItem.gender}
        netWeight={sampleItem.netWeight}
        meatOnlyWeight={sampleItem.meatOnlyWeight}
        totalShares={sampleItem.totalShares}
        approxShareSize={sampleItem.approxShareSize}
        perShareCost={sampleItem.perShareCost}
        cutSize={sampleItem.cutSize}
        headLegsBrainPrice={sampleItem.headLegsBrainPrice}
        headPrice={sampleItem.headPrice}
        legsPrice={sampleItem.legsPrice}
        brainPrice={sampleItem.brainPrice}
        botiShareCost={sampleItem.botiShareCost}
        extraCost={sampleItem.extraCost}
        deliveryDateTimestamp={sampleItem.deliveryDateTimestamp}
        totalBotiShares={sampleItem.totalBotiShares}
        remainingBotiShares={sampleItem.remainingBotiShares}
        headLegsBrainAvailability={sampleItem.headLegsBrainAvailability}
        headAvailability={sampleItem.headAvailability}
        brainAvailability={sampleItem.brainAvailability}
        legsAvailability={sampleItem.legsAvailability}
        remainingShares={sampleItem.remainingShares}
        remainingExtraShares={sampleItem.remainingExtraShares}
        order={order}
        setOrder={setOrder}
      />

      {/* {order.meatRequirements.length > 0 && (
        <div className={styles.checkOutWrap}>
          <p>
            Total : <span> ₹ {order.totalBill}</span>
          </p>
          <button onClick={() => setShowCheckOutForm(true)}>Check out</button>
        </div>
      )} */}
      <div className={styles.checkOutWrap}>
        <p>
          Total : <span> ₹ {order.totalBill}</span>
        </p>
        <button onClick={() => setShowCheckOutForm(true)}>Check out</button>
      </div>
      {showCheckOutForm && (
        <div
          className={
            showCheckOutForm
              ? `${styles.CheckOutFormOpen} ${styles.checkOutForm}`
              : styles.checkOutForm
          }
        >
          <CheckOutForm setShowCheckOutForm={setShowCheckOutForm} />
        </div>
      )}
    </div>
  );
};

export default Catalog;
