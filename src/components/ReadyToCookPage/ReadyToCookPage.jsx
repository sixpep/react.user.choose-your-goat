import React, { useContext, useEffect, useState } from "react";
import styles from "./ReadyToCookPage.module.css";
import { LuMoveLeft } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import QuantityControllerComp from "./QuantityControllerComp/QuantityControllerComp";
import { BsHandbag } from "react-icons/bs";
import { Context } from "../../App";
import { motion } from "framer-motion";
import { db } from "../../firebase/setup";
import { where, collection, doc, getDoc, onSnapshot, query, orderBy, limit, getDocs } from "firebase/firestore";
import { getCurrentDay } from "../../utils/getDay.utils";
import { lowDeliveryFeePincodes } from "../../staticValues";

const ReadyToCookPage = () => {
  const navigate = useNavigate();
  const { readyToCookData, order } = useContext(Context);

  console.log(order);

  function onBag() {
    if (localStorage.getItem("choose-your-goat-userId")) {
      navigate("/cart");
    } else {
      navigate("/login?redirect=/cart");
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.backBar}>
          <div className={styles.backBtn} onClick={() => (window.location.pathname = "/home")}>
            <i>
              <LuMoveLeft size={20} />
            </i>
          </div>
        </div>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <h6>
              Ready To Cook <br />
              (Marinated)
            </h6>
          </div>
          <div className={styles.deliveryDate}>
            <p>New Year Special Only</p>
            <h6>
              31st December <br /> <span>(12PM to 9PM)</span>
            </h6>
          </div>
        </div>
        <div className={styles.quanityControllers}>
          {readyToCookData.map((item, index) => (
            <QuantityControllerComp key={index} name={item.name} description={item.description} price={item.price} size={item.size} docId={item.docId} isOrderAllowed={item.isAllowed} />
          ))}
        </div>
      </div>
      <div className={styles.checkOutWrap}>
        <p>
          Total Price:{" "}
          <span>
            {" "}
            ₹{order.totalBill} + <span style={{ fontSize: "14px" }}>{`${lowDeliveryFeePincodes.includes(localStorage.getItem("true-meat-location")) ? 35 : 55}(delivery fee)`}</span>
          </span>
        </p>
        <button
          onClick={onBag}
          disabled={order.totalBill <= 0}
          style={{
            opacity: order.meatRequirements.length < 1 ? 0.5 : 1,
          }}
        >
          <BsHandbag />
          <p>Bag</p>
        </button>
      </div>
    </div>
  );
};

export default ReadyToCookPage;
