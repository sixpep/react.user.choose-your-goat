import React from "react";
import styles from "./Tile.module.css";

const Tile = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.tileImage}>
          <img src="/images/goatLogo.jpeg" alt="Goat Logo" />
        </div>
        <div className={styles.goatDetails}>
          <p>
            Gender: <span>Male (పొట్టేలు)</span>
          </p>
          <p>
            Net weight: <span>19 kgs</span>
          </p>
          <p>
            Expected meat-only weight (including liver): <span>10 kgs</span>
          </p>
          <p>
            Total shares: <span>20</span>
          </p>
          <p>
            Approx share size: <span>500 gms</span>
          </p>
          <p>
            Per share cost: <span>390</span>
          </p>
          <p>
            Size: <span>Curry cut</span>
          </p>
          <p>
            Talkaya + Kaalu + Brain: <span>650</span>
          </p>
          <p>
            Takaya: <span>350</span>
          </p>
          <p>
            Kaalu: <span>250</span>
          </p>
          <p>
            Brain: <span>100</span>
          </p>
          <p>
            Tilli, Heart, Liver, Testicles, etc.: <span>200</span>
          </p>
          <p>
            Boti (2 shares, share cost): <span>200</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Tile;
