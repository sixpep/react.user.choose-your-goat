import React, { useContext, useMemo } from "react";
import styles from "../../Meat Catalog/Tile Component/Tile.module.css";
import { Context } from "../../../App";

const QuantityControllerComp = ({ name, price, description, size, docId }) => {
  const { order, setOrder } = useContext(Context);

  const currentItem = useMemo(() => order.meatRequirements.find((item) => item.docId === docId), [order.meatRequirements, docId]);

  const quantity = currentItem?.quantity ?? 0;

  const handleIncrement = () => {
    setOrder((prev) => {
      const existingIndex = prev.meatRequirements.findIndex((item) => item.docId === docId);

      const updatedMeatRequirements =
        existingIndex !== -1
          ? prev.meatRequirements.map((item, index) => (index === existingIndex ? { ...item, quantity: item.quantity + 1 } : item))
          : [...prev.meatRequirements, { docId, name, quantity: 1 }];

      return {
        ...prev,
        orderType: prev.meatRequirements.length === 0 ? "readytocook" : prev.orderType,
        meatRequirements: updatedMeatRequirements,
        totalBill: prev.totalBill + price,
      };
    });
  };

  const handleDecrement = () => {
    if (!currentItem) return;

    setOrder((prev) => {
      const updatedMeatRequirements =
        currentItem.quantity > 1
          ? prev.meatRequirements.map((item) => (item.docId === docId ? { ...item, quantity: item.quantity - 1 } : item))
          : prev.meatRequirements.filter((item) => item.docId !== docId);

      return {
        ...prev,
        meatRequirements: updatedMeatRequirements,
        totalBill: prev.totalBill - price,
      };
    });
  };

  return (
    <div className={styles.quantityControl}>
      <div className={styles.label}>
        <div className={styles.itemLabelWrap}>
          <p>{name}</p>
        </div>
      </div>

      {description && <span>{description}</span>}

      <div className={styles.controlPrices}>
        <div className={styles.price}>
          <p>₹ {price}</p>
          <span> / {size}</span>
        </div>

        <div className={styles.quantityButtons}>
          <button onClick={handleDecrement} disabled={quantity === 0}>
            −
          </button>
          <p>{quantity}</p>
          <button onClick={handleIncrement}>+</button>
        </div>
      </div>
    </div>
  );
};

export default QuantityControllerComp;
