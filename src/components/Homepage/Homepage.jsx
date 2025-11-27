import React, { useContext } from "react";
import styles from "./Homepage.module.css";
import MeatTile from "./MeatTile";
import { Context } from "../../App";

function Homepage() {
  const { deliveryLocation, locationMeta } = useContext(Context);

  // If meta exists → get permission flags
  const allowMutton = locationMeta?.allowMuttonOrders ?? false;
  const allowChicken = locationMeta?.allowChickenOrders ?? false;
  const allowEggs = locationMeta?.allowEggOrders ?? false;

  return (
    <div className={styles.homeContainer}>
      {/* -------- Header section -------- */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Welcome</h2>
          <p className={styles.subtitle}>
            Delivering to <strong>{deliveryLocation || "----"}</strong>
          </p>
        </div>
      </div>

      {/* -------- Category Tiles -------- */}
      <div className={styles.tilesWrapper}>
        <MeatTile title="Mutton" image="/images/mutton.png" isActive={allowMutton} navigateTo="/mutton" />

        <MeatTile title="Chicken" image="/images/chicken.png" isActive={allowChicken} navigateTo="/chicken" />

        <MeatTile title="Eggs" image="/images/eggs.png" isActive={allowEggs} navigateTo="/egg" />
      </div>
    </div>
  );
}

export default Homepage;
