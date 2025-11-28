import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ChickenPage.module.css";
import { Context } from "../../App";

// Temporary static products — later replace with Firestore
const CHICKEN_PRODUCTS = [
  {
    id: "chicken_skinless_500",
    title: "Skinless Chicken - 500g",
    price: 175,
    unit: "500g",
    description: "Fresh, skinless cut, ideal for curry and fry.",
    isActive: true,
  },
  {
    id: "chicken_boneless_250",
    title: "Boneless Chicken - 250g",
    price: 160,
    unit: "250g",
    description: "Tender boneless cubes, perfect for tikka and grills.",
    isActive: true,
  },
  {
    id: "chicken_leg_quarter",
    title: "Leg Quarters - 2 pcs",
    price: 190,
    unit: "2 pieces",
    description: "Juicy leg pieces for roast and biryani.",
    isActive: false, // example of disabled product
  },
];

function ChickenPage() {
  const navigate = useNavigate();
  const { locationMeta, addToCart, cart, cartCount, cartTotal, updateCartItemQuantity } = useContext(Context);

  const allowChicken = locationMeta?.allowChickenOrders ?? false;

  const handleBack = () => {
    navigate("/home");
  };

  const handleAdd = (product) => {
    if (!allowChicken || !product.isActive) return;

    const currentQty = getQuantityInCart(product.id);

    if (currentQty === 0) {
      // first time add
      addToCart({
        id: `${product.id}-${Date.now()}`,
        type: "chicken",
        skuId: product.id,
        title: product.title,
        pricePerUnit: product.price,
        quantity: 1,
        totalPrice: product.price,
      });
    } else {
      // increase existing
      updateCartItemQuantity("chicken", product.id, currentQty + 1);
    }
  };

  const handleDecrease = (product) => {
    const currentQty = getQuantityInCart(product.id);
    if (currentQty <= 0) return;
    updateCartItemQuantity("chicken", product.id, currentQty - 1);
  };

  const getQuantityInCart = (productId) => {
    const line = cart.items.find((item) => item.type === "chicken" && item.skuId === productId);
    return line?.quantity || 0;
  };

  return (
    <div className={styles.page}>
      {/* Simple header for Chicken page */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={handleBack}>
          ←
        </button>
        <div className={styles.headerTitleBlock}>
          <div className={styles.headerTitle}>Chicken</div>
          <div className={styles.headerSubtitle}>Fresh cuts, ready to cook</div>
        </div>
      </header>

      {/* Availability message based on location */}
      {!allowChicken && <div className={styles.infoBanner}>We are not accepting chicken orders for your location right now.</div>}

      <div className={styles.listWrapper}>
        {CHICKEN_PRODUCTS.map((product) => {
          const qty = getQuantityInCart(product.id);
          const disabled = !allowChicken || !product.isActive;

          return (
            <div key={product.id} className={`${styles.card} ${disabled ? styles.cardDisabled : ""}`}>
              {/* If you have images later, use <img src={product.imageUrl} ... /> */}
              <div className={styles.cardContent}>
                <div className={styles.cardTitle}>{product.title}</div>
                <div className={styles.cardUnit}>{product.unit}</div>
                <div className={styles.cardDesc}>{product.description}</div>

                <div className={styles.cardBottomRow}>
                  <div className={styles.priceBlock}>
                    ₹{product.price}
                    <span className={styles.priceUnit}> / {product.unit}</span>
                  </div>

                  {qty === 0 ? (
                    <button className={styles.addBtn} onClick={() => handleAdd(product)} disabled={disabled}>
                      {disabled ? "Not available" : "Add"}
                    </button>
                  ) : (
                    <div className={styles.qtyControl}>
                      <button className={styles.qtyBtn} onClick={() => handleDecrease(product)}>
                        -
                      </button>
                      <span className={styles.qtyValue}>{qty}</span>
                      <button className={styles.qtyBtn} onClick={() => handleAdd(product)}>
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {CHICKEN_PRODUCTS.length === 0 && <div className={styles.emptyState}>No chicken items are listed yet.</div>}
      </div>

      {/* Cart footer for this page */}
      {cartCount > 0 && (
        <div className={styles.cartFooter} onClick={() => navigate("/cart")}>
          <div className={styles.cartFooterIconWrap}>
            <img src="/icons/cart.svg" alt="cart" className={styles.cartFooterIcon} />
            <span className={styles.cartBadge}>{cartCount}</span>
          </div>
          <span className={styles.cartFooterText}>
            ₹{cartTotal} • {cartCount} item{cartCount > 1 ? "s" : ""} • Proceed to checkout
          </span>
        </div>
      )}
    </div>
  );
}

export default ChickenPage;
