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
  const navigate = useNavigate();

  const { order } = useContext(Context);
  const userId = order.userId;
  //   const userId = "LO7kskxIKiUczDaEiMnTMATWzrl1";

  const mappingOrderKeys = {
    numberOfHeadShares: "Head (తలకాయ) ",
    numberOfBrainShares: "Brain (మెదడు)",
    numberOfMuttonShares: "Mutton",
    numberOfLegsShares: "Legs (కాలు)",
    numberOfExtras: "Gizzards",
    numberOfBotiShares: "Boti (బోటి)",
  };

  useEffect(() => {
    if (localStorage.getItem("choose-your-goat-token")) {
      setUserLoggedIn(true);
    } else {
      setUserLoggedIn(false);
    }

    // Set up real-time listener on the orders collection
    const unsubscribe = onSnapshot(
      collection(db, "orders"),
      (querySnapshot) => {
        const userOrders = [];

        // Loop through all orders and filter meatRequirements for the user
        querySnapshot.forEach((doc) => {
          const orderData = doc.data();

          console.log("Orderdata in user orders", orderData);

          if (orderData.userId === userId) {
            userOrders.push(orderData);
          }
        });
        // Update state with the filtered orders
        setUserOrders(userOrders);
        console.log(userOrders);
      },
      (error) => {
        console.error("Error listening to orders:", error);
      }
    );

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [userId]);

  return (
    <div>
      <div className={styles.backBar}>
        <div className={styles.backBtn} onClick={() => navigate("/")}>
          <i>
            <LuMoveLeft size={20} />
          </i>
          <p>Back</p>
        </div>
      </div>
      <h2>User Orders</h2>
      {userLoggedIn && userOrders.length > 0 ? (
        userOrders.map((order) => (
          <div
            key={order.id}
            style={{
              border: "1px solid #ccc",
              margin: "10px",
              padding: "10px",
            }}
          >
            {order.meatRequirements.map((eachGoat) => {
              return (
                <div className={styles.goatRequirements}>
                  {Object.keys(eachGoat).map((keyName) => {
                    if (keyName !== "goatId")
                      return (
                        <div>
                          <p>
                            {mappingOrderKeys[keyName]} : {eachGoat[keyName]}
                          </p>
                          <p>Delivery Date : {eachGoat.deliveryDate}</p>
                        </div>
                      );
                  })}
                </div>
              );
            })}

            <div className={styles.orderDetails}>
              <p>Total Bill : {order.totalBill}</p>
            </div>

            {/* <h3>Order ID: {order.id}</h3>
            {order.meatRequirements && order.meatRequirements.length > 0 ? (
              order.meatRequirements.map((item, index) => (
                <div key={index} style={{ margin: "5px 0" }}>
                  <p>Quantity: {item.quantity}</p>
                  <p>Bill: {item.bill}</p>
                </div>
              ))
            ) : (
              <p>No items in this order for the given user.</p>
            )} */}
          </div>
        ))
      ) : (
        <p>No orders found!</p>
      )}
    </div>
  );
};

export default UserOrders;
