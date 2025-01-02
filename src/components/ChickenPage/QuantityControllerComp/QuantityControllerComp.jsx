import React, { useContext, useEffect } from "react";
import styles from "../../Meat Catalog/Tile Component/Tile.module.css";
import { Context } from "../../../App";

const QuantityControllerComp = ({
  henName,
  chickenPrice,
  description,
  chickenWeight,
  docId,
  isOrderAllowed,
}) => {
  const { order, setOrder } = useContext(Context);

  const currentHenDoc = order.meatRequirements.find(
    (item) => item.henId === docId
  );

  const handleIncrement = () => {
    if (!isOrderAllowed) return;

    if (order.meatRequirements.length === 0) {
      setOrder((prev) => ({
        ...prev,
        orderType: "chicken",
      }));
    }
    const existingHenIndex = order.meatRequirements.findIndex(
      (item) => item.henId === docId
    );

    if (existingHenIndex !== -1) {
      // Create a new array with updated quantity for the current hen
      const updatedMeatRequirements = [...order.meatRequirements];
      updatedMeatRequirements[existingHenIndex] = {
        ...updatedMeatRequirements[existingHenIndex],
        quantity: updatedMeatRequirements[existingHenIndex].quantity + 1,
      };

      setOrder((prev) => ({
        ...prev,
        meatRequirements: updatedMeatRequirements,
        totalBill: prev.totalBill + chickenPrice, // Add chicken price
      }));
    } else {
      // Add a new item if it doesn't exist
      setOrder((prev) => ({
        ...prev,
        meatRequirements: [
          ...prev.meatRequirements,
          { henId: docId, henName: henName, quantity: 1 },
        ],
        totalBill: prev.totalBill + chickenPrice, // Add chicken price
      }));
    }

    console.log("Order in inc", order);
  };

  const handleDecrement = () => {
    const existingHenIndex = order.meatRequirements.findIndex(
      (item) => item.henId === docId
    );

    if (existingHenIndex !== -1) {
      if (!isOrderAllowed) return;

      const updatedMeatRequirements = [...order.meatRequirements];
      const currentQuantity =
        updatedMeatRequirements[existingHenIndex].quantity;

      if (currentQuantity > 1) {
        // Decrement the quantity if greater than 1
        updatedMeatRequirements[existingHenIndex] = {
          ...updatedMeatRequirements[existingHenIndex],
          quantity: currentQuantity - 1,
        };

        setOrder((prev) => ({
          ...prev,
          meatRequirements: updatedMeatRequirements,
          totalBill: prev.totalBill - chickenPrice, // Subtract chicken price
        }));
      } else {
        // Remove the item if quantity is 1 or less
        const filteredMeatRequirements = updatedMeatRequirements.filter(
          (item) => item.henId !== docId
        );

        setOrder((prev) => ({
          ...prev,
          meatRequirements: filteredMeatRequirements,
          totalBill: prev.totalBill - chickenPrice, // Subtract chicken price
        }));
      }
    }
    console.log("Order in dec", order);
  };

  return (
    <div className={styles.quantityControl}>
      <div className={styles.label}>
        <div className={styles.itemLabelWrap}>
          <p>{henName}</p>
        </div>
      </div>
      <span>{description}</span>

      <div className={styles.controlPrices}>
        <div className={styles.price}>
          <p>
            ₹ {chickenPrice}
            <span style={{ color: "#BC1414", fontSize: "20px" }}>*</span>
            {/* <span>/{chickenWeight}g</span> */}
          </p>
        </div>
        <div
          className={styles.quantityButtons}
          style={{
            opacity: isOrderAllowed ? 1 : 0.5,
          }}
        >
          <button onClick={handleDecrement}>-</button>
          <p>{currentHenDoc ? currentHenDoc["quantity"] : 0}</p>

          <button onClick={handleIncrement}>+</button>
        </div>
      </div>
    </div>
  );
};

export default QuantityControllerComp;
