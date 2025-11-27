import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MeatTile.module.css";

const MeatTile = ({ title, image, isActive, navigateTo }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!isActive) return; // blocked card → ignore click
    navigate(navigateTo);
  };

  return (
    <div className={`${styles.tile} ${!isActive ? styles.disabled : ""}`} onClick={handleClick}>
      <img src={image} alt={title} className={styles.image} />

      <h3 className={styles.title}>{title}</h3>

      <p className={styles.status}>{isActive ? "Order now" : "Not accepting orders"}</p>
    </div>
  );
};

export default MeatTile;
