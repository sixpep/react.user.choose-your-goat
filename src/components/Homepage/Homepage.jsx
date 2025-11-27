import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Homepage.module.css";
import MeatTile from "./MeatTile";
import { Context } from "../../App";

function Homepage() {
  const { deliveryLocation, locationMeta } = useContext(Context);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("token");
  const storedName = localStorage.getItem("userName");
  const greetingName = isLoggedIn && storedName ? storedName : "Meat Lover";

  const allowMutton = locationMeta?.allowMuttonOrders ?? false;
  const allowChicken = locationMeta?.allowChickenOrders ?? false;
  const allowEggs = locationMeta?.allowEggOrders ?? false;

  // Cart from localStorage (JSON)
  const rawCart = localStorage.getItem("cart");
  let cartCount = 0;
  if (rawCart) {
    try {
      const parsed = JSON.parse(rawCart);
      if (Array.isArray(parsed)) {
        cartCount = parsed.length;
      } else if (Array.isArray(parsed.items)) {
        cartCount = parsed.items.length;
      }
    } catch (e) {
      cartCount = 0;
    }
  }

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    window.location.reload();
  };

  const handleCart = () => {
    if (cartCount === 0) return;
    navigate("/cart");
  };

  const handleOrders = () => {
    navigate("/orders");
  };

  const handleChangeLocation = () => {
    localStorage.removeItem("deliveryPincode");
    window.location.reload(); // App.js will show location modal again
  };

  const banners = [
    { id: 1, image: "/banners/banner1.jpeg" },
    { id: 2, image: "/banners/banner2.png" },
    { id: 3, image: "/banners/banner3.jpg" },
  ];

  return (
    <div className={styles.homeContainer}>
      {/* Global style header */}

      <header className={styles.headerBar}>
        <img
          src="/logo.png" // use white or black logo as per your theme
          alt="True Meat"
          className={styles.headerLogo}
        />

        <div className={styles.headerActions}>
          {/* Support icon - always visible */}
          <a href="tel:+919999999999">
            <img src="/icons/support.svg" alt="support" className={styles.headerIcon} />
          </a>

          {isLoggedIn && (
            <>
              <img src="/icons/orders.svg" alt="orders" className={styles.headerIcon} onClick={handleOrders} />
              <img src="/icons/logout.svg" alt="logout" className={styles.headerIcon} onClick={handleLogout} />
            </>
          )}

          {!isLoggedIn && <img src="/icons/login.svg" alt="login" className={styles.headerIcon} onClick={handleLogin} />}
        </div>
      </header>

      {/* Hero: Delivering pill + greeting */}
      <section className={styles.heroSection}>
        <div className={styles.deliveryPill}>
          <span className={styles.deliveryDot} />
          <span className={styles.deliveryText}>
            Delivering to <strong className={styles.deliveryValue}>{deliveryLocation || "Choose location"}</strong>
          </span>
          <button type="button" className={styles.changePincodeBtn} onClick={handleChangeLocation}>
            Change
          </button>
        </div>

        <div className={styles.greetingRow}>
          <div className={styles.avatarCircle}>{greetingName.charAt(0).toUpperCase()}</div>
          <div className={styles.greetingText}>
            <div className={styles.greetingTitle}>Hello {greetingName},</div>
            <div className={styles.greetingSubtitle}>It&apos;s Meat Time!</div>
          </div>
        </div>
      </section>

      {/* Banner carousel (images only) */}
      <div className={styles.bannerStrip}>
        <div className={styles.bannerScroll}>
          {banners.map((banner) => (
            <img key={banner.id} src={banner.image} alt="banner" className={styles.bannerImageOnly} />
          ))}
        </div>
      </div>

      {/* Category tiles */}
      <div className={styles.tilesWrapper}>
        <MeatTile title="Mutton" image="/images/mutton.png" isActive={allowMutton} navigateTo="/mutton" />
        <MeatTile title="Chicken" image="/images/chicken.png" isActive={allowChicken} navigateTo="/chicken" />
        <MeatTile title="Eggs" image="/images/eggs.png" isActive={allowEggs} navigateTo="/egg" />
      </div>

      {/* Cart footer */}
      {cartCount > 0 && (
        <div className={styles.cartFooter} onClick={handleCart}>
          <div className={styles.cartFooterIconWrap}>
            <img src="/icons/cart.svg" alt="cart" className={styles.cartFooterIcon} />
            <span className={styles.cartBadge}>{cartCount}</span>
          </div>
          <span className={styles.cartFooterText}>Proceed to checkout</span>
        </div>
      )}
    </div>
  );
}

export default Homepage;
