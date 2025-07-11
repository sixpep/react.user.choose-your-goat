import React from "react";
import styles from "./Navbar.module.css";
import { IoIosLogOut } from "react-icons/io";
import { IoLocationOutline } from "react-icons/io5";

const Navbar = ({ selectLocationPopup, setSelectLocationPopup, locationName }) => {
  const handleLogOut = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleOrdersButton = () => {
    window.location.href = "orders";
  };
  const openSelectLocation = () => {
    setSelectLocationPopup(true);
  };
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.logoContainer}>
          <img src="/images/logo.png" alt="" />
          {/* <h6>Choose Your Goat</h6> */}
        </div>

        <div className={styles.navButtons}>
          {localStorage.getItem("choose-your-goat-token") ? (
            <>
              <button onClick={openSelectLocation} className={styles.locationButton}>
                <IoLocationOutline />
                <span>{locationName || "Pincode"}</span>
              </button>
              <button onClick={handleOrdersButton}>Orders</button>
              <button onClick={handleLogOut}>
                <IoIosLogOut size={24} />
              </button>
            </>
          ) : (
            <>
              <button onClick={openSelectLocation} className={styles.locationButton}>
                <IoLocationOutline />
                <span>{locationName || "Pincode"}</span>
              </button>
              <button className={styles.loginBtn} onClick={() => (window.location.href = "/login")}>
                <img src="/images/loginLogo.png" alt="" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
