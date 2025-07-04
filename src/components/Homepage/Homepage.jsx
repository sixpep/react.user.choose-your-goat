import React, { useState, useEffect } from "react";
import styles from "./Homepage.module.css";
import MeatTile from "./MeatTileComponent/MeatTile";
import { motion } from "framer-motion";
import { db } from "../../firebase/setup";
import { doc, getDoc } from "firebase/firestore";

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
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupData, setPopupData] = useState({});

  useEffect(() => {
    const fetchPopupData = async () => {
      try {
        const popupReference = doc(db, "popupConfig", "homeOnStartup");
        const popupDoc = await getDoc(popupReference);

        if (popupDoc.exists()) {
          const popupDocData = popupDoc.data();
          if (popupDocData.show) {
            setPopupData(popupDocData.message); // keep as HTML string
            setPopupVisible(true);
          }
        }
      } catch (error) {
        console.error("Error fetching popup:", error);
      }
    };

    fetchPopupData();
  }, []);

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
              <div dangerouslySetInnerHTML={{ __html: popupData }} />
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
