import React from "react";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const handleLogOut = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleOrdersButton = () => {
    window.location.href = "orders";
  };
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.logoContainer}>
          {/* <div className={styles.logoImageContainer}>
            <img src="/images/goatLogo.jpeg" alt="" />
          </div> */}
          <h6>Choose Your Goat</h6>
        </div>

        <div className={styles.navButtons}>
          <button onClick={handleLogOut}>Log Out</button>
          <button onClick={handleOrdersButton}>Orders</button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
