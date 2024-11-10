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
          <h6>Choose Your Goat</h6>
        </div>

        {localStorage.getItem("choose-your-goat-token") && (
          <div className={styles.navButtons}>
            <button onClick={handleOrdersButton}>Orders</button>
            <button onClick={handleLogOut}>
              <IoIosLogOut size={24} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
