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

    // const unsubscribe = onSnapshot(
    //   collection(db, "orders"),
    //   (querySnapshot) => {
    //     const userOrders = [];

    //     querySnapshot.forEach((doc) => {
    //       const orderData = doc.data();

    //       if (orderData.userId === userId) {
    //         userOrders.push(orderData);
    //       }
    //     });

    //     console.log("userOrders", userOrders);

    //     setUserOrders(userOrders);
    //     setShowFetchingOrdersLoading(false);
    //   },
    //   (error) => {
    //     console.error("Error listening to orders:", error);
    //   }
    // );

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

        onSnapshot(
          collection(db, "chickenOrders"),
          (chickenQuerySnapshot) => {
            chickenQuerySnapshot.forEach((doc) => {
              const chickenOrderData = doc.data();

              if (chickenOrderData.userId === userId) {
                userOrders.push(chickenOrderData);
              }
            });

            console.log("userOrders", userOrders);

            userOrders.sort((a, b) => {
              // Get the timestamp for comparison
              const timestampA = a.orderedDate || a.deliveryDate;
              const timestampB = b.orderedDate || b.deliveryDate;

              // Sort in descending order
              return timestampB - timestampA;
            });

            setUserOrders(userOrders);
            setShowFetchingOrdersLoading(false);
          },
          (error) => {
            console.error("Error listening to chicken orders:", error);
          }
        );
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

      {userLoggedIn ? (
        showFetchingOrdersLoading ? (
          <div className={styles.verifyOtpContainer}>
            <div className={styles.loader}></div>
            <h6>Fetching your orders!</h6>
          </div>
        ) : userOrders.length > 0 ? (
          userOrders.map((order) => {
            if (order.orderType !== "chicken") {
              return (
                <div
                  key={order.id}
                  style={{
                    border: "1px solid #ccc",
                    margin: "10px",
                    padding: "10px",
                  }}
                >
                  <div className={styles.goatRequirements}>
                    {Object.keys(order).map((keyName) =>
                      keyNames[keyName] ? (
                        <div key={keyName}>
                          <p>
                            {keyNames[keyName]} : {order[keyName]}
                          </p>
                        </div>
                      ) : null
                    )}
                  </div>
                  <div className={styles.orderDetails}>
                    <p>
                      Delivery Date:{" "}
                      {new Date(order.deliveryDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={styles.orderDetails}>
                    <p>Total Bill: {order.totalBill}</p>
                  </div>
                </div>
              );
            } else {
              return (
                <div
                  key={order.id}
                  style={{
                    border: "1px solid #ccc",
                    margin: "10px",
                    padding: "10px",
                  }}
                >
                  <div className={styles.goatRequirements}>
                    {order.meatRequirements.map((item) => (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <p>
                          {item.henName} ({item.quantity})
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className={styles.orderDetails}>
                    <p>
                      Delivery Date:{" "}
                      {new Date(
                        order.deliveryDate || order.orderedDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={styles.orderDetails}>
                    <p>Total Bill: {order.totalBill}</p>
                  </div>
                </div>
              );
            }
          })
        ) : (
          <h1 className="text-center border-2 border-dotted py-4 font-semibold">
            No orders for this user!
          </h1>
        )
      ) : (
        <p style={{ textAlign: "center", margin: "2rem 0" }}>
          Please login to see orders!
        </p>
      )}

      {/* {userLoggedIn && showFetchingOrdersLoading && (
        <div className={styles.verifyOtpContainer}>
          <div className={styles.loader}></div>
          <h6>Fetching your orders!</h6>
        </div>
      )}

      {userLoggedIn && userOrders.length > 0 ? (
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
        ))
      ) : (
        <h1 className="text-center border-2 border-dotted py-4 font-semibold">
          No orders for this users
        </h1>
      )}

      {!userLoggedIn && (
        <p style={{ textAlign: "center", margin: "2rem 0" }}>
          Please login to see orders!
        </p>
      )} */}
    </div>
  );
};

export default UserOrders;
