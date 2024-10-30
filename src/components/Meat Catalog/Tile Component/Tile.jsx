import React from "react";
import styles from "./Tile.module.css";

const Tile = ({
  goatImages,
  gender,
  netWeight,
  meatOnlyWeight,
  totalShares,
  approxShareSize,
  perShareCost,
  cutSize,
  headLegsBrainPrice,
  headPrice,
  legsPrice,
  brainPrice,
  extraCost,
  totalBotiShares,
  botiShareCost,
  deliveryDateTimestamp,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.tileImage}>
          <img
            src={goatImages ? goatImages[0] : "/images/goat1.jpeg"}
            alt="Goat Logo"
          />
        </div>
        <div className={styles.goatDetails}>
          <p>
            Gender: <span>{gender}</span>
          </p>
          <p>
            Net weight: <span>{netWeight}</span>
          </p>
          <p>
            Expected meat-only weight (including liver):{" "}
            <span>{meatOnlyWeight}</span>
          </p>
          <p>
            Total shares: <span>{totalShares}</span>
          </p>
          <p>
            Approx share size: <span>{approxShareSize}</span>
          </p>
          <p>
            Per share cost: <span>₹ {perShareCost}/-</span>
          </p>
          <p>
            Size: <span>{cutSize}</span>
          </p>
          <p>
            Talkaya + Kaalu + Brain: <span>₹{headLegsBrainPrice}/-</span>
          </p>
          <p>
            Talkaya: <span>₹ {headPrice}/-</span>
          </p>
          <p>
            Kaalu: <span>₹ {legsPrice}/-</span>
          </p>
          <p>
            Brain: <span>₹ {brainPrice}/-</span>
          </p>
          <p>
            Tilli, Heart, Liver, Testicles, etc.: <span>₹ {extraCost}/-</span>
          </p>
          <p>
            Boti (2 shares, share cost): <span>₹ {botiShareCost}/-</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Tile;
