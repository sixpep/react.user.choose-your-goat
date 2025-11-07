import React, { useContext, useEffect, useState } from "react";
import styles from "./ChickenPage.module.css";
import { LuMoveLeft } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import QuantityControllerComp from "./QuantityControllerComp/QuantityControllerCompForEggs";
import { BsHandbag } from "react-icons/bs";
import { Context } from "../../App";
import { motion } from "framer-motion";
import { db } from "../../firebase/setup";
import { where, collection, getDocs, query, limit } from "firebase/firestore";
import { getCurrentDay } from "../../utils/getDay.utils";
import { lowDeliveryFeePincodes } from "../../staticValues";

const EggPage = () => {
  const navigate = useNavigate();
  const { eggsData, order } = useContext(Context);

  console.log("eggsData", eggsData);

  const [ordersAllowed, setOrdersAllowed] = useState(true);
  const [wentWrong, setWentWrong] = useState(false);

  useEffect(() => {
    async function checkPermission() {
      try {
        let permissionDoc = await getDocs(
          query(collection(db, "availability"), where("pincode", "==", localStorage.getItem("true-meat-location")), limit(1))
        );

        if (!permissionDoc.empty) {
          const data = permissionDoc.docs[0].data();
          if (data.eggOrders) {
            setOrdersAllowed(true);
          } else {
            setOrdersAllowed(false);
          }
        } else {
          setOrdersAllowed(true);
        }
      } catch (error) {
        console.log(error);
        setWentWrong(true);
      }
    }

    checkPermission();
  }, []);

  function onEggBag() {
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
              Fresh <br />
              Eggs{" "}
              <div className={styles.iconWrap}>
                <img src="/images/eggIcon.png" alt="Egg Icon" />
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

        <div className={styles.banner}>
          <img src="/images/eggBanner.png" alt="Egg Banner" />
        </div>

        <div className={styles.quanityControllers}>
          {eggsData.map(
            (item, index) =>
              item.shortDayAvail &&
              item.shortDayAvail.includes(getCurrentDay(true)) && (
                <QuantityControllerComp
                  key={index}
                  eggName={item.eggName}
                  description={item.description}
                  eggPrice={item.eggPrice}
                  eggCount={item.eggCount}
                  docId={item.docId}
                />
              )
          )}
        </div>
      </div>

      <div className={styles.checkOutWrap}>
        <div className={styles.asterikNote}>
          <p style={{ color: "#BC1414" }}>* </p>
          <h6>The final price may vary based on quantity.</h6>
        </div>
        <p>
          Total Price:{" "}
          <span>
            ₹{order.totalBill} +{" "}
            <span style={{ fontSize: "14px" }}>
              {`${lowDeliveryFeePincodes.includes(localStorage.getItem("true-meat-location")) ? 35 : 55} (delivery fee)`}
            </span>
          </span>
        </p>
        <button
          onClick={onEggBag}
          disabled={order.totalBill <= 0}
          style={{
            opacity: order.meatRequirements.length < 1 ? 0.5 : 1,
          }}
        >
          <BsHandbag />
          <p>Bag</p>
        </button>
      </div>

      {!ordersAllowed && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <div>
              <strong>Sorry!, We are currently not accepting egg orders at your location.</strong>
            </div>
            <button className={styles.closeButton} onClick={() => (window.location.href = "/home")}>
              Close
            </button>
          </div>
        </div>
      )}

      {wentWrong && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <div>
              <strong>Something went wrong. Please try again.</strong>
            </div>
            <button className={styles.closeButton} onClick={() => (window.location.href = "/home")}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EggPage;
