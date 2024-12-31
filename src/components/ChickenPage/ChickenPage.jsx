import React, { useContext, useEffect } from "react";
import styles from "./ChickenPage.module.css";
import { LuMoveLeft } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import QuantityControllerComp from "./QuantityControllerComp/QuantityControllerComp";
import { BsHandbag } from "react-icons/bs";
import { Context } from "../../App";

const ChickenPage = () => {
  const navigate = useNavigate();
  const { hensData, order } = useContext(Context);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.backBar}>
          <div
            className={styles.backBtn}
            onClick={() => (window.location.pathname = "/home")}
          >
            <i>
              <LuMoveLeft size={20} />
            </i>
          </div>
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
            <h6>Every Day</h6>
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
            />
          ))}
        </div>
      </div>
      <div className={styles.checkOutWrap}>
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
