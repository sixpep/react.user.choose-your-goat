import React from "react";
import styles from "./Catalog.module.css";
import Tile from "./Tile Component/Tile";

const Catalog = () => {
  return (
    <div className={styles.container}>
      <Tile />
    </div>
  );
};

export default Catalog;
