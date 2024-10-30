import React from "react";
import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.logoContainer}>
          <div className={styles.logoImageContainer}>
            <img src="/images/goatLogo.jpeg" alt="" />
          </div>

          <h6>Choose Your Goat</h6>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
