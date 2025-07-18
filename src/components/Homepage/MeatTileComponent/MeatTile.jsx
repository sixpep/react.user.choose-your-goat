import React from "react";
import styles from "./MeatTile.module.css";

const MeatTile = ({ title, imgSrc, tilePath, hide }) => {
  const handleTileClick = () => {
    window.location.pathname = tilePath;
  };
  return (
    <div className={styles.container} onClick={!hide ? handleTileClick : () => {}}>
      <div className={styles.title}>
        <h6>{title}</h6>
      </div>
      <div className={styles.meatImage}>
        <img src={imgSrc} alt="meat" />
      </div>
      {hide && (
        <div className={styles.overlay}>
          <span className={styles.overlayText}>Not accepting orders now</span>
        </div>
      )}
    </div>
  );
};

export default MeatTile;
