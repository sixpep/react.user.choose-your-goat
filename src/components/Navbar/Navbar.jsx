import React from "react";
import styles from "./Navbar.module.css";
import { IoIosLogOut } from "react-icons/io";

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
          <img src="/images/logo.png" alt="" />
          {/* <h6>Choose Your Goat</h6> */}
        </div>

        {localStorage.getItem("choose-your-goat-token") ? (
          <div className={styles.navButtons}>
            <button onClick={handleOrdersButton}>Orders</button>
            <button onClick={handleLogOut}>
              <IoIosLogOut size={24} />
            </button>
          </div>
        ) : (
          <div className={styles.navButtons}>
            <button
              className={styles.loginBtn}
              onClick={() => (window.location.href = "/login")}
            >
              <img src="/images/loginLogo.png" alt="" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
