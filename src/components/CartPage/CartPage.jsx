import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CartPage.module.css";
import { Context } from "../../App";

function CartPage() {
  const navigate = useNavigate();
  const { cart, cartCount, cartTotal, updateCartItemQuantity, removeFromCart, clearCart } = useContext(Context);

  const handleBack = () => {
    navigate("/home");
  };

  const handleDecrease = (item) => {
    const newQty = (item.quantity || 0) - 1;
    if (newQty <= 0) {
      // remove line
      removeFromCart((line) => line.type === item.type && line.skuId === item.skuId);
    } else {
      updateCartItemQuantity(item.type, item.skuId, newQty);
    }
  };

  const handleIncrease = (item) => {
    const newQty = (item.quantity || 0) + 1;
    updateCartItemQuantity(item.type, item.skuId, newQty);
  };

  const handleRemove = (item) => {
    removeFromCart((line) => line.type === item.type && line.skuId === item.skuId);
  };

  const handlePlaceOrder = () => {
    if (cartCount === 0) return;

    // TEMP: Just simulate success and clear cart
    alert("Order placed! (dummy action for now)");
    clearCart();
    navigate("/home");
  };

  const getTypeLabel = (type) => {
    if (type === "mutton") return "Mutton";
    if (type === "chicken") return "Chicken";
    if (type === "egg") return "Eggs";
    return "";
  };

  const hasItems = cart.items && cart.items.length > 0;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={handleBack}>
          ←
        </button>
        <div className={styles.headerTitleBlock}>
          <div className={styles.headerTitle}>Your Cart</div>
          <div className={styles.headerSubtitle}>{cartCount > 0 ? `${cartCount} item${cartCount > 1 ? "s" : ""}` : "No items added yet"}</div>
        </div>
      </header>

      {!hasItems && (
        <div className={styles.emptyState}>
          <p>Your cart is empty.</p>
          <button className={styles.emptyBtn} onClick={() => navigate("/home")}>
            Browse items
          </button>
        </div>
      )}

      {hasItems && (
        <div className={styles.listWrapper}>
          {cart.items.map((item) => (
            <div key={`${item.type}-${item.skuId}`} className={styles.card}>
              <div className={styles.cardTopRow}>
                <div>
                  <div className={styles.itemTitle}>{item.title}</div>
                  <div className={styles.itemMeta}>
                    {getTypeLabel(item.type)} • ₹{item.pricePerUnit} each
                  </div>
                </div>
                <button className={styles.removeBtn} onClick={() => handleRemove(item)}>
                  Remove
                </button>
              </div>

              <div className={styles.cardBottomRow}>
                <div className={styles.qtyControl}>
                  <button className={styles.qtyBtn} onClick={() => handleDecrease(item)}>
                    -
                  </button>
                  <span className={styles.qtyValue}>{item.quantity}</span>
                  <button className={styles.qtyBtn} onClick={() => handleIncrease(item)}>
                    +
                  </button>
                </div>

                <div className={styles.lineTotal}>₹{item.totalPrice || item.pricePerUnit * item.quantity}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer summary + Place order */}
      {hasItems && (
        <div className={styles.cartFooter}>
          <div className={styles.cartSummary}>
            <div className={styles.cartTotalLabel}>Total</div>
            <div className={styles.cartTotalValue}>₹{cartTotal}</div>
            <div className={styles.cartTotalMeta}>
              {cartCount} item{cartCount > 1 ? "s" : ""}
            </div>
          </div>
          <button className={styles.placeOrderBtn} onClick={handlePlaceOrder} disabled={cartCount === 0}>
            Place order
          </button>
        </div>
      )}
    </div>
  );
}

export default CartPage;
