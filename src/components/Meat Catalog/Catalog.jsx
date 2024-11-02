import React, { useEffect, useState } from "react";
import styles from "./Catalog.module.css";
import Tile from "./Tile Component/Tile";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const Catalog = () => {
  const [goatsData, setGoatsData] = useState([]);

  useEffect(() => {
    socket.on("goatsData", (data) => {
      console.log(data);
      setGoatsData(data);
    });

    return () => {
      socket.off("goatsData");
    };
  }, []);

  return (
    <div className={styles.container}>
      {goatsData?.map((item, index) => {
        return (
          <Tile
            key={index}
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
          />
        );
      })}
      <Tile
        gender="Male"
        netWeight={12}
        meatOnlyWeight={10}
        totalShares={18}
        approxShareSize={500}
        perShareCost={396}
        cutSize="Curry Cut"
        headLegsBrainPrice={648}
        headPrice={350}
        legsPrice={248}
        brainPrice={97}
        botiShareCost={200}
        extraCost={200}
      />{" "}
      <Tile
        gender="Male"
        netWeight={12}
        meatOnlyWeight={10}
        totalShares={18}
        approxShareSize={500}
        perShareCost={396}
        cutSize="Curry Cut"
        headLegsBrainPrice={648}
        headPrice={350}
        legsPrice={248}
        brainPrice={97}
        botiShareCost={200}
        extraCost={200}
      />
      <Tile
        gender="Male"
        netWeight={12}
        meatOnlyWeight={10}
        totalShares={18}
        approxShareSize={500}
        perShareCost={396}
        cutSize="Curry Cut"
        headLegsBrainPrice={648}
        headPrice={350}
        legsPrice={248}
        brainPrice={97}
        botiShareCost={200}
        extraCost={200}
      />
    </div>
  );
};

export default Catalog;
