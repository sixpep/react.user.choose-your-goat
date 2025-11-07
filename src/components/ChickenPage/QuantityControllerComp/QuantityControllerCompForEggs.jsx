import React, { useContext } from "react";
import styles from "../../Meat Catalog/Tile Component/Tile.module.css";
import { Context } from "../../../App";

const QuantityControllerCompForEggs = ({ eggName, eggPrice, description, eggCount, docId }) => {
  const { order, setOrder } = useContext(Context);

  const currentEggDoc = order.meatRequirements.find((item) => item.eggId === docId);

  const handleIncrement = () => {
    // If first item, set order type to "egg"
    if (order.meatRequirements.length === 0) {
      setOrder((prev) => ({
        ...prev,
        orderType: "egg",
      }));
    }

    const existingEggIndex = order.meatRequirements.findIndex((item) => item.eggId === docId);

    if (existingEggIndex !== -1) {
      // Update existing egg quantity
      const updatedRequirements = [...order.meatRequirements];
      updatedRequirements[existingEggIndex] = {
        ...updatedRequirements[existingEggIndex],
        quantity: updatedRequirements[existingEggIndex].quantity + 1,
      };

      setOrder((prev) => ({
        ...prev,
        meatRequirements: updatedRequirements,
        totalBill: prev.totalBill + eggPrice,
      }));
    } else {
      // Add new egg item
      setOrder((prev) => ({
        ...prev,
        meatRequirements: [...prev.meatRequirements, { eggId: docId, eggName, quantity: 1 }],
        totalBill: prev.totalBill + eggPrice,
      }));
    }

    console.log("Order increment (egg):", order);
  };

  const handleDecrement = () => {
    const existingEggIndex = order.meatRequirements.findIndex((item) => item.eggId === docId);

    if (existingEggIndex !== -1) {
      const updatedRequirements = [...order.meatRequirements];
      const currentQuantity = updatedRequirements[existingEggIndex].quantity;

      if (currentQuantity > 1) {
        // Decrement quantity
        updatedRequirements[existingEggIndex] = {
          ...updatedRequirements[existingEggIndex],
          quantity: currentQuantity - 1,
        };

        setOrder((prev) => ({
          ...prev,
          meatRequirements: updatedRequirements,
          totalBill: prev.totalBill - eggPrice,
        }));
      } else {
        // Remove item completely
        const filteredRequirements = updatedRequirements.filter((item) => item.eggId !== docId);

        setOrder((prev) => ({
          ...prev,
          meatRequirements: filteredRequirements,
          totalBill: prev.totalBill - eggPrice,
        }));
      }
    }

    console.log("Order decrement (egg):", order);
  };

  return (
    <div className={styles.quantityControl}>
      <div className={styles.label}>
        <div className={styles.itemLabelWrap}>
          <p>{eggName}</p>
        </div>
      </div>

      <span>{description}</span>

      <div className={styles.controlPrices}>
        <div className={styles.price}>
          <p>
            ₹ {eggPrice}
            <span style={{ color: "#BC1414", fontSize: "20px" }}>*</span>
            {/* <span> / {eggCount} pcs</span> */}
          </p>
        </div>

        <div className={styles.quantityButtons}>
          <button onClick={handleDecrement}>-</button>
          <p>{currentEggDoc ? currentEggDoc["quantity"] : 0}</p>
          <button onClick={handleIncrement}>+</button>
        </div>
      </div>
    </div>
  );
};

export default QuantityControllerCompForEggs;
