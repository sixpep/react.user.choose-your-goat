import React, { useState } from "react";
import styles from "./Homepage.module.css";
import MeatTile from "./MeatTileComponent/MeatTile";
import { color, motion } from "framer-motion";

const MeatTileProps = [
  {
    title: "Mutton",
    imgSrc: "/images/mutonRightEdge.png",
    tilePath: "/mutton",
  },
  {
    title: "Chicken",
    imgSrc: "/images/chickenRightEdge.png",
    tilePath: "/chicken",
  },
];

const Homepage = () => {
  const [isPopupVisible, setPopupVisible] = useState(true);

  const closePopup = () => {
    setPopupVisible(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Popup Section */}
        {isPopupVisible && (
          <div className={styles.popup}>
            <div className={styles.popupContent}>
              <p>
                Due to a glitch in the app, some mutton orders may have failed without notifying the users. If you placed an order but don’t see it in
                your order history, or if your order hasn’t arrived by <strong>8:30 AM</strong>, please contact us at{" "}
                <strong style={{ color: "#bc1414" }}>7382949469</strong>.
              </p>
              <button className={styles.closeButton} onClick={closePopup}>
                Close
              </button>
            </div>
          </div>
        )}

        {/* <div className={styles.deliveryNote}>
          <p>We are currently serving only in Sangareddy</p>
        </div> */}
        <div className={styles.deliveryNote}>
          <motion.p
            animate={{ scale: [1, 1.1, 1] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          >
            We are currently serving only in Sangareddy
          </motion.p>
        </div>
        <div className={styles.tileHeader}>
          <div className={styles.goatDp}>
            <img src="/images/goatDp.png" alt="" />
          </div>
          <div className={styles.greeting}>
            <p>
              Hello <span>Meat Lover</span>
              <img src="/images/handWaveSymbol.png" alt="" />
            </p>
            <p>It's Meat Time!</p>
          </div>
        </div>
        <div className={styles.offerBanner}>
          <img src="/images/homeBanner.png" alt="" />
        </div>
        <div className={styles.choosingTitleWrap}>
          <h2>
            What would <br />
            you
            <span className={styles.choosingTitle}> like to order?</span>
          </h2>
        </div>
        <div className={styles.meatTiles}>
          {MeatTileProps.map((tile, ind) => (
            <MeatTile key={ind} title={tile.title} imgSrc={tile.imgSrc} tilePath={tile.tilePath} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
