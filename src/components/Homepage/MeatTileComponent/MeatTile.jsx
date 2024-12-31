import React from "react";
import styles from "./MeatTile.module.css";

const MeatTile = ({ title, imgSrc, tilePath }) => {
  const handleTileClick = () => {
    window.location.pathname = tilePath;
  };
  return (
    <div className={styles.container} onClick={handleTileClick}>
      <div className={styles.title}>
        <h6>{title}</h6>
      </div>
      <div className={styles.meatImage}>
        <img src={imgSrc} alt="meat" />
      </div>
    </div>
  );
};

export default MeatTile;
