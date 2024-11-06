import React, { useContext, useEffect } from "react";
import styles from "./Cart.module.css";
import { LuMoveLeft } from "react-icons/lu";
import CheckOutForm from "../Check Out Form/CheckOutForm";
import { Context } from "../../../App";

const Cart = () => {
  const { order, setOrder } = useContext(Context);

  const keyNames = {
    numberOfMuttonShares: "Mutton",
    numberOfHeadShares: "Head",
    numberOfLegsShares: "Legs",
    numberOfBrainShares: "Brain",
    numberOfBotiShares: "Boti",
    numberOfExtras: "Extras",
  };

  // const currentGoatDoc = order.meatRequirements.find(
  //   (item) => item.goatId === docId
  // );

  // const handleIncrement = (keyName, availability) => {
  //   if (currentGoatDoc) {
  //     const currentValue = currentGoatDoc[keyName] || 0;
  //     if (currentGoatDoc[keyName] && currentGoatDoc[keyName] < availability) {
  //       setOrder((prev) => ({
  //         ...prev,
  //         meatRequirements: prev.meatRequirements.map((item) =>
  //           item.goatId === docId
  //             ? { ...item, [keyName]: currentValue + 1 }
  //             : item
  //         ),
  //       }));
  //     } else if (!currentGoatDoc[keyName]) {
  //       setOrder((prev) => ({
  //         ...prev,
  //         meatRequirements: prev.meatRequirements.map((item) =>
  //           item.goatId === docId ? { ...item, [keyName]: 1 } : item
  //         ),
  //       }));
  //     }
  //   } else {
  //     setOrder((prev) => ({
  //       ...prev,
  //       meatRequirements: [
  //         ...prev.meatRequirements,
  //         { goatId: docId, [keyName]: 1 },
  //       ],
  //     }));
  //   }
  // };

  // const handleDecrement = (keyName) => {
  //   if (currentGoatDoc && currentGoatDoc[keyName]) {
  //     const currentValue = currentGoatDoc[keyName];
  //     const newValue = currentValue - 1;
  //     if (newValue > 0) {
  //       setOrder((prev) => ({
  //         ...prev,
  //         meatRequirements: prev.meatRequirements.map((item) =>
  //           item.goatId === docId
  //             ? { ...item, [keyName]: currentValue - 1 }
  //             : item
  //         ),
  //       }));
  //     } else {
  //       setOrder((prev) => ({
  //         ...prev,
  //         meatRequirements: prev.meatRequirements.map((item) => {
  //           if (item.goatId === docId) {
  //             const { [keyName]: removedKey, ...rest } = item;
  //             return rest;
  //           }
  //           return item;
  //         }),
  //       }));

  //       setOrder((prev) => ({
  //         ...prev,
  //         meatRequirements: prev.meatRequirements.filter((item) => {
  //           return !(Object.keys(item).length < 2);
  //         }),
  //       }));
  //     }
  //   }
  // };

  const handleIncrement = (goatId, keyName) => {
    order.meatRequirements.find((item) => item.goatId === goatId);
  };

  useEffect(() => {
    console.log(order);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.backBar}>
          <div
            className={styles.backBtn}
            onClick={() => (window.location.href = "/")}
          >
            <i>
              <LuMoveLeft size={20} />
            </i>
            <p>Back</p>
          </div>
        </div>

        <div className={styles.carts}>
          {order.meatRequirements.map((goatObj, index) => (
            <div className={styles.cartItemsWrap} key={index}>
              {Object.keys(goatObj).map((keyName) => {
                if (keyNames[keyName]) {
                  return (
                    <div className={styles.cartItem} key={keyName}>
                      <p>{keyNames[keyName]}</p>
                      <div className={styles.priceValues}>
                        <div className={styles.quantityButtons}>
                          <button>-</button>
                          <input
                            type="text"
                            id={keyName}
                            readOnly
                            value={goatObj[keyName]}
                          />
                          <button>+</button>
                        </div>
                        <p>₹ {2 * 400}/-</p>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          ))}

          {/* <div className={styles.cartItemsWrap}>
            <div className={styles.cartItem}>
              <p>Mutton</p>
              <div className={styles.quantityButtons}>
                <button>-</button>
                <input
                  type="text"
                  id="numberOfMuttonShares"
                  readOnly
                  value={20}
                />
                <button>+</button>
              </div>

              <p>₹ {2 * 400}/-</p>
            </div>
            <div className={styles.cartItem}>
              <p>Talkaya</p>
              <div className={styles.quantityButtons}>
                <button>-</button>
                <input
                  type="text"
                  id="numberOfMuttonShares"
                  readOnly
                  value={20}
                />
                <button>+</button>
              </div>

              <p>₹ {350}/-</p>
            </div>
          </div> */}
        </div>
        <CheckOutForm />
      </div>
    </div>
  );
};

export default Cart;
