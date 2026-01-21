import React, { useContext, useMemo } from "react";
import styles from "../../Meat Catalog/Tile Component/Tile.module.css";
import styles2 from "./QuantityControllerComp.module.css";
import { Context } from "../../../App";

const QuantityControllerComp = ({ name, price, description, size, docId, isAllowed }) => {
  const { order, setOrder } = useContext(Context);

  const currentItem = useMemo(() => order.meatRequirements.find((item) => item.docId === docId), [order.meatRequirements, docId]);

  const quantity = currentItem?.quantity ?? 0;

  const handleIncrement = () => {
    if (!isAllowed) return;

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
    if (!currentItem || !isAllowed) return;

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
    <div className={`${styles.quantityControl} ${!isAllowed ? styles2.disabledCard : ""}`}>
      {!isAllowed && <div className={styles2.soldOutBadge}>Sold Out</div>}

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
          <button onClick={handleDecrement} disabled={!isAllowed || quantity === 0}>
            −
          </button>
          <p>{quantity}</p>
          <button onClick={handleIncrement} disabled={!isAllowed}>
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuantityControllerComp;
