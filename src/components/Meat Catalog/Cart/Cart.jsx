import React from "react";
import styles from "./Cart.module.css";
import { LuMoveLeft } from "react-icons/lu";
import CheckOutForm from "../Check Out Form/CheckOutForm";

const Cart = () => {
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
          <div className={styles.cartItemsWrap}>
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
          </div>
          <div className={styles.cartItemsWrap}>
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
          </div>
        </div>
        <CheckOutForm />
      </div>
    </div>
  );
};

export default Cart;
