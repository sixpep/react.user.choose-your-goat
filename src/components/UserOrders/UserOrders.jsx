import React, { useContext, useEffect, useState } from "react";
import styles from "./UserOrders.module.css";
import { collection, onSnapshot } from "firebase/firestore";
import { Context } from "../../App";
import { db } from "../firebase/setup";
import { LuMoveLeft } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const UserOrders = () => {
  const [userOrders, setUserOrders] = useState([]);
  const [userLoggedIn, setUserLoggedIn] = useState(true);
  const [showFetchingOrdersLoading, setShowFetchingOrdersLoading] =
    useState(true);
  const navigate = useNavigate();

  const { order } = useContext(Context);
  const userId = order.userId;
  //   const userId = "LO7kskxIKiUczDaEiMnTMATWzrl1";

  useEffect(() => {
    if (localStorage.getItem("choose-your-goat-token")) {
      setUserLoggedIn(true);
    } else {
      setUserLoggedIn(false);
    }

    const unsubscribe = onSnapshot(
      collection(db, "orders"),
      (querySnapshot) => {
        const userOrders = [];

        querySnapshot.forEach((doc) => {
          const orderData = doc.data();

          if (orderData.userId === userId) {
            userOrders.push(orderData);
          }
        });

        console.log("userOrders", userOrders);

        setUserOrders(userOrders);
        setShowFetchingOrdersLoading(false);
      },
      (error) => {
        console.error("Error listening to orders:", error);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const keyNames = {
    numberOfMuttonShares: "Mutton",
    numberOfHeadShares: "Head",
    numberOfLegsShares: "Legs",
    numberOfBrainShares: "Brain",
    numberOfBotiShares: "Boti",
    numberOfExtras: "Extras",
  };

  return (
    <div className={styles.container}>
      <div className={styles.backBar}>
        <div className={styles.backBtn} onClick={() => navigate("/")}>
          <i>
            <LuMoveLeft size={20} />
          </i>
          <p>Back</p>
        </div>
      </div>
      {showFetchingOrdersLoading && (
        <div className={styles.verifyOtpContainer}>
          <div className={styles.loader}></div>
          <h6>Fetching your orders!</h6>
        </div>
      )}

      {userLoggedIn &&
        userOrders.length > 0 &&
        userOrders?.map((order) => (
          <div
            key={order.id}
            style={{
              border: "1px solid #ccc",
              margin: "10px",
              padding: "10px",
            }}
          >
            <div className={styles.goatRequirements}>
              {Object.keys(order).map((keyName) => {
                if (keyNames[keyName])
                  return (
                    <div>
                      <p>
                        {keyNames[keyName]} : {order[keyName]}
                      </p>
                    </div>
                  );
              })}
            </div>

            <div className={styles.orderDetails}>
              <p>
                Delivery Date :{" "}
                {new Date(order.deliveryDate).toLocaleDateString()}
              </p>
            </div>
            <div className={styles.orderDetails}>
              <p>Total Bill : {order.totalBill}</p>
            </div>
          </div>
        ))}

      {!userLoggedIn && (
        <p style={{ textAlign: "center", margin: "2rem 0" }}>
          Please login to see orders!
        </p>
      )}
    </div>
  );
};

export default UserOrders;
