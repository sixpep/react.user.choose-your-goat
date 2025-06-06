import React, { useContext, useEffect, useState } from "react";
import styles from "./ChickenPage.module.css";
import { LuMoveLeft } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import QuantityControllerComp from "./QuantityControllerComp/QuantityControllerComp";
import { BsHandbag } from "react-icons/bs";
import { Context } from "../../App";
import { motion } from "framer-motion";

const ChickenPage = () => {
  const navigate = useNavigate();
  // const [isOrderAllowed, setIsOrderAllowed] = useState(false);
  const { hensData, order } = useContext(Context);

  // useEffect(() => {
  //   const checkTime = () => {
  //     const currentHour = new Date().getHours();
  //     if (currentHour >= 8 && currentHour < 20) {
  //       setIsOrderAllowed(true);
  //     } else {
  //       setIsOrderAllowed(false);
  //     }
  //   };
  //   checkTime();
  //   const interval = setInterval(checkTime, 60000);

  //   return () => clearInterval(interval);
  // }, []);

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
        <div className={styles.deliveryNote}>
          <motion.p
            animate={{ scale: [1, 1.1, 1] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          >
            We are currently serving only in Sangareddy
          </motion.p>
        </div>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <h6>
              Fresh <br />
              Chicken{" "}
              <div className={styles.iconWrap}>
                <img src="/images/chickenIcon.png" alt="" />
              </div>
            </h6>
          </div>
          <div className={styles.deliveryDate}>
            <p>Delivery</p>
            <h6>
              Every Day <br /> <span>(8AM to 8PM)</span>
            </h6>
          </div>
        </div>
        <div className={styles.wholeChickenBanner}>
          <img src="/images/wholeChickenBanner.png" alt="" />
        </div>
        <div className={styles.quanityControllers}>
          {hensData.map((item, index) => (
            <QuantityControllerComp
              key={index}
              henName={item.henName}
              description={item.description}
              chickenPrice={item.chickenPrice}
              chickenWeight={item.chickenWeight}
              docId={item.docId}
              // isOrderAllowed={isOrderAllowed}
            />
          ))}
        </div>
      </div>
      <div className={styles.checkOutWrap}>
        <div className={styles.asterikNote}>
          <p style={{ color: "#BC1414" }}>* </p>
          <h6>The final price may vary based on the size of the chicken.</h6>
        </div>
        <p>
          Total Price: <span> ₹{order.totalBill}</span>
        </p>
        <button
          onClick={() => navigate("/cart")}
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

export default ChickenPage;
