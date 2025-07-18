import React, { useState, useEffect } from "react";
import styles from "./Homepage.module.css";
import MeatTile from "./MeatTileComponent/MeatTile";
import { motion } from "framer-motion";
import { db } from "../../firebase/setup";
import { collection, doc, getDoc, getDocs, onSnapshot, query, orderBy, limit, where } from "firebase/firestore";

// const Homepage = ({ selectLocationPopup, setSelectLocationPopup, setLocationName, locationName, isPopupVisible, setPopupVisible }) => {
const Homepage = ({ isPopupVisible, setPopupVisible }) => {
  const [popupData, setPopupData] = useState({});
  const [muttonRestricted, setMuttonRestricted] = useState(false);
  const [chickenRestricted, setChickenRestricted] = useState(false);

  const MeatTileProps = [
    {
      title: "Mutton",
      imgSrc: "/images/mutonRightEdge.png",
      tilePath: "/mutton",
      restrictedAt: muttonRestricted,
    },
    {
      title: "Chicken",
      imgSrc: "/images/chickenRightEdge.png",
      tilePath: "/chicken",
      restrictedAt: chickenRestricted,
    },
  ];

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

    const getRestrictions = async () => {
      try {
        const q = query(collection(db, "availability"), where("pincode", "==", localStorage.getItem("true-meat-location")), limit(1));
        const snapshot = await getDocs(q);
        let pincodes = [];
        if (!snapshot.empty) {
          pincodes = snapshot.docs[0].data(); // This is your single matching document
        } else {
          // alert("Selected pincode is not valid.");
        }

        setChickenRestricted(!pincodes.chickenOrders);
        setMuttonRestricted(!pincodes.muttonOrders);
      } catch (error) {
        return error;
      }
    };

    fetchPopupData();
    getRestrictions();
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
        {/* <div className={styles.deliveryNote}>
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
        </div> */}
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
            <MeatTile key={ind} title={tile.title} imgSrc={tile.imgSrc} hide={tile.restrictedAt} tilePath={tile.tilePath} />
          ))}
        </div>
        <footer className={styles.footer}>
          <p>
            📞 <strong>Customer Care:</strong> <a href="tel:+917382949469">+91 73829 49469</a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Homepage;
