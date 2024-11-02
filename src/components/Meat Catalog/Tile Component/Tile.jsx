import React, { useState } from "react";
import styles from "./Tile.module.css";

const Tile = ({
  goatImage,
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
  headLegsBrainAvailability,
  remainingBotiShares,
  brainAvailability,
  remainingShares,
  headAvailability,
  legsAvailability,
}) => {
  // State to manage quantity for each item
  const [headQuantity, setHeadQuantity] = useState(0);
  const [legsQuantity, setLegsQuantity] = useState(0);
  const [brainQuantity, setBrainQuantity] = useState(0);
  const [botiQuantity, setBotiQuantity] = useState(0);

  // Handlers to control quantity increment and decrement
  const handleIncrement = (setter) => setter((prev) => prev + 1);
  const handleDecrement = (setter, quantity) => {
    if (quantity > 0) setter((prev) => prev - 1);
  };

  const handleDeliveryDate = (timestamp) => {
    const options = { weekday: "long", month: "short", day: "numeric" };
    return new Date(timestamp).toLocaleDateString("en-US", options);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.tileImage}>
          <img src={goatImage || "/images/goat1.jpeg"} alt="Goat Logo" />
        </div>
        <h3>Delivers {handleDeliveryDate(deliveryDateTimestamp)}</h3>
        <div className={styles.goatDetails}>
          <div className={styles.descriptionTable}>
            <table>
              <tbody>
                <tr>
                  <td>Gender </td>
                  <td>:</td>
                  <td>{gender}</td>
                </tr>
                <tr>
                  <td>Net weight </td>
                  <td>:</td>
                  <td>{netWeight}</td>
                </tr>
                <tr>
                  <td>
                    Meat weight <br />
                    (Liver included)
                  </td>
                  <td>:</td>
                  <td>{meatOnlyWeight}</td>
                </tr>
                <tr>
                  <td>Total shares</td>
                  <td>:</td>
                  <td>{totalShares}</td>
                </tr>
                <tr>
                  <td>Approx share size </td>
                  <td>:</td>
                  <td>{approxShareSize}</td>
                </tr>
                <tr>
                  <td>Per share cost</td>
                  <td>:</td>
                  <td>₹ {perShareCost}/-</td>
                </tr>
                <tr>
                  <td>Size</td>
                  <td>:</td>
                  <td>{cutSize}</td>
                </tr>
                <tr>
                  <td>Total boti shares</td>
                  <td>:</td>
                  <td>{totalBotiShares}</td>
                </tr>
                <tr>
                  <td>
                    Extras Cost
                    <br />
                    (Tilli, Heart, Testicles, and Kidney)
                  </td>
                  <td>:</td>
                  <td>₹ {extraCost}/-</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Interactive Quantity Controls */}
          <div className={styles.quantityControl}>
            <p>Mutton : (₹{perShareCost})</p>
            <div className={styles.quantityLabels}>
              <div className={styles.quantityButtons}>
                <button
                  onClick={() => handleDecrement(setHeadQuantity, headQuantity)}
                >
                  -
                </button>
                <input type="text" value={headQuantity} readOnly />
                <button onClick={() => handleIncrement(setHeadQuantity)}>
                  +
                </button>
              </div>
              <span>₹ {perShareCost * headQuantity}/-</span>
            </div>
            <span className={styles.availableNote}>
              (Available: {remainingShares || 0} shares)
            </span>
          </div>
          <div className={styles.quantityControl}>
            <p>Talkaya + Kaalu + Brain : (₹{headLegsBrainPrice})</p>
            <div className={styles.quantityLabels}>
              <div className={styles.quantityButtons}>
                <button
                  onClick={() => handleDecrement(setHeadQuantity, headQuantity)}
                >
                  -
                </button>
                <input type="text" value={headQuantity} readOnly />
                <button onClick={() => handleIncrement(setHeadQuantity)}>
                  +
                </button>
              </div>
              <span>₹ {headPrice * headQuantity}/-</span>
            </div>
            <span className={styles.availableNote}>
              (Available:{" "}
              {headAvailability && legsAvailability && brainAvailability
                ? 1
                : 0}{" "}
              set)
            </span>
          </div>
          <div className={styles.quantityControl}>
            <p>Talkaya: (₹{headPrice})</p>
            <div className={styles.quantityLabels}>
              <div className={styles.quantityButtons}>
                <button
                  onClick={() => handleDecrement(setHeadQuantity, headQuantity)}
                >
                  -
                </button>
                <input type="text" value={headQuantity} readOnly />
                <button onClick={() => handleIncrement(setHeadQuantity)}>
                  +
                </button>
              </div>
              <span>₹ {headPrice * headQuantity}/-</span>
            </div>
            <span className={styles.availableNote}>
              (Available: {headAvailability || 0})
            </span>
          </div>
          <div className={styles.quantityControl}>
            <p>Kaalu: (₹{legsPrice})</p>
            <div className={styles.quantityLabels}>
              <div className={styles.quantityButtons}>
                <button
                  onClick={() => handleDecrement(setLegsQuantity, legsQuantity)}
                >
                  -
                </button>
                <input type="text" value={legsQuantity} readOnly />
                <button onClick={() => handleIncrement(setLegsQuantity)}>
                  +
                </button>
              </div>
              <span>₹ {legsPrice * legsQuantity}/-</span>
            </div>
            <span className={styles.availableNote}>
              (Available: {headLegsBrainAvailability || 0} set)
            </span>
          </div>
          <div className={styles.quantityControl}>
            <p>Brain: (₹{brainPrice})</p>
            <div className={styles.quantityLabels}>
              <div className={styles.quantityButtons}>
                <button
                  onClick={() =>
                    handleDecrement(setBrainQuantity, brainQuantity)
                  }
                >
                  -
                </button>
                <input type="text" value={brainQuantity} readOnly />
                <button onClick={() => handleIncrement(setBrainQuantity)}>
                  +
                </button>
              </div>
              <span>₹ {brainPrice * brainQuantity}/-</span>
            </div>
            <span className={styles.availableNote}>
              (Available: {brainAvailability || 0} set)
            </span>
          </div>
          <div className={styles.quantityControl}>
            <p>Boti: (₹{botiShareCost})</p>
            <div className={styles.quantityLabels}>
              <div className={styles.quantityButtons}>
                <button
                  onClick={() => handleDecrement(setBotiQuantity, botiQuantity)}
                >
                  -
                </button>
                <input type="text" value={botiQuantity} readOnly />
                <button onClick={() => handleIncrement(setBotiQuantity)}>
                  +
                </button>
              </div>
              <span>₹ {botiShareCost * botiQuantity}/-</span>
            </div>
            <span className={styles.availableNote}>
              (Available : {remainingBotiShares} shares)
            </span>
          </div>

          {/* Add to Cart Button */}
          <div className={styles.addToCartWrap}>
            <button className={styles.addToCartButton}>Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tile;
