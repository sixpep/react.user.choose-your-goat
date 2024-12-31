import React from "react";
import styles from "./Homepage.module.css";
import MeatTile from "./MeatTileComponent/MeatTile";

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
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.deliveryNote}>
          <p>We are currently serving only in Sangareddy</p>
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
            <MeatTile
              key={ind}
              title={tile.title}
              imgSrc={tile.imgSrc}
              tilePath={tile.tilePath}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
