import React, { useEffect, useState } from "react";
import styles from "./Tile.module.css";
import Carousel from "../Carousel/Carousel";
import { FaInfoCircle } from "react-icons/fa";

const Tile = ({
  docId,
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
  order,
  setOrder,
}) => {
  // State to manage quantity for each item
  const [muttonQuantity, setMuttonQuantity] = useState(0);
  const [headQuantity, setHeadQuantity] = useState(0);
  const [legsQuantity, setLegsQuantity] = useState(0);
  const [brainQuantity, setBrainQuantity] = useState(0);
  const [botiQuantity, setBotiQuantity] = useState(0);
  const [extrasQuantity, setExtrasQuantity] = useState(0);
  const [headLegsBrainQuantity, setHeadLegsBrainQuantity] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const meat = {
    goatId: docId,
    numberOfMuttonShares: muttonQuantity,
    numberOfHeadLegsBrainShares: headLegsBrainQuantity,
    numberOfHeadShares: headQuantity,
    numberOfLegsShares: legsQuantity,
    numberOfBrainShares: brainQuantity,
    numberOfBotiShares: botiQuantity,
    numberOfExtras: extrasQuantity,
  };
  const [addedToCart, setAddedToCart] = useState(false);
  var extrasAvailability = 1;

  // Handlers to control quantity increment and decrement
  const handleIncrement = (setter, availability, quantity) => {
    if (quantity < availability) setter((prev) => prev + 1);
  };

  const handleDecrement = (setter, quantity) => {
    if (quantity > 0) {
      setter((prev) => prev - 1);
    }
  };

  const handleDeliveryDate = (timestamp) => {
    const options = { weekday: "long", month: "short", day: "numeric" };
    return new Date(timestamp).toLocaleDateString("en-US", options);
  };

  const updateCart = (newRequirement) => {
    if (
      headQuantity === 0 &&
      legsQuantity === 0 &&
      brainQuantity === 0 &&
      headLegsBrainQuantity === 0 &&
      botiQuantity === 0 &&
      extrasQuantity === 0
    ) {
      alert("No items to add to cart!");
      return;
    }
    setOrder((prevOrder) => {
      // Find the existing requirement by ID
      const existingRequirement = prevOrder.meatRequirements.find(
        (req) => req.goatId === newRequirement.goatId
      );

      if (existingRequirement) {
        // If found, map through and update the object
        return {
          ...prevOrder,
          meatRequirements: prevOrder.meatRequirements.map((req) =>
            req.goatId === newRequirement.goatId
              ? { ...req, ...newRequirement }
              : req
          ),
        };
      } else {
        // If not found, add the new requirement
        return {
          ...prevOrder,
          meatRequirements: [...prevOrder.meatRequirements, newRequirement],
        };
      }
    });
    console.log(order);
  };

  const handleQuantitychange = (e) => {
    const { id, value } = e.target;

    if (
      headQuantity === 0 &&
      legsQuantity === 0 &&
      brainQuantity === 0 &&
      headLegsBrainQuantity === 0 &&
      botiQuantity === 0 &&
      extrasQuantity === 0
    ) {
      setOrder((prevOrder) => ({
        ...prevOrder,
        meatRequirements: prevOrder.meatRequirements.filter(
          (item) => item.goatId === docId
        ),
      }));
    } else {
      setOrder((prevOrder) => {
        const existingIndex = prevOrder.meatRequirements.findIndex(
          (item) => item.goatId === docId
        );

        if (existingIndex !== -1) {
          // Update existing item
          const updatedRequirements = [...prevOrder.meatRequirements];
          updatedRequirements[existingIndex] = meat; // Replace the existing item with the new meat object
          return { ...prevOrder, meatRequirements: updatedRequirements };
        } else {
          // Add the new meat object since it doesn't exist
          return {
            ...prevOrder,
            meatRequirements: [...prevOrder.meatRequirements, meat],
          };
        }
      });
    }

    console.log("order quantiy : ", order);
  };

  useEffect(() => {
    const updatedBill =
      muttonQuantity * perShareCost +
      headQuantity * headPrice +
      legsQuantity * legsPrice +
      brainQuantity * brainPrice +
      headLegsBrainQuantity * headLegsBrainPrice +
      botiQuantity * botiShareCost +
      extrasQuantity * extraCost;

    setOrder((prevOrder) => ({
      ...prevOrder,
      totalBill: updatedBill,
    }));
    console.log("order variable in catalog", order);
  }, [
    muttonQuantity,
    headQuantity,
    legsQuantity,
    brainQuantity,
    headLegsBrainQuantity,
    botiQuantity,
    extrasQuantity,
  ]);

  const handleShowGoatInfo = () => {
    setIsVisible(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 3000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.tileImage}>
          {/* <Carousel images={[goatImage, "/images/goat1.jpeg"]} /> */}
          <Carousel
            images={[
              "/images/goat1.jpeg",
              "/images/goat1.jpeg",
            ]}
          />
          <i onClick={handleShowGoatInfo}>
            <FaInfoCircle color="white" size={20} style={{ zIndex: "100" }} />
          </i>
        </div>
        <h3>
          Delivers <br /> {handleDeliveryDate(deliveryDateTimestamp)}
        </h3>
        <div className={styles.goatDetails}>
          {isVisible && (
            <div
              className={`${styles.descriptionTable} ${
                !isVisible ? styles.hidden : ""
              }`}
            >
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
          )}

          {/* Interactive Quantity Controls */}
          <div className={styles.quantityControl}>
            <p>
              Mutton : (₹{perShareCost}) <br />
              <span>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Repellat ab sit voluptate quis harum veniam?
              </span>
            </p>

            <div className={styles.quantityLabels}>
              <div className={styles.quantityButtons}>
                <button
                  onClick={() =>
                    handleDecrement(setMuttonQuantity, muttonQuantity)
                  }
                >
                  -
                </button>
                <input
                  type="text"
                  id="numberOfMuttonShares"
                  onChange={handleQuantitychange}
                  value={muttonQuantity}
                  readOnly
                />
                <button
                  onClick={() =>
                    handleIncrement(
                      setMuttonQuantity,
                      remainingShares,
                      muttonQuantity
                    )
                  }
                >
                  +
                </button>
              </div>
              <span>₹ {perShareCost * muttonQuantity}/-</span>
            </div>
            <span className={styles.availableNote}>
              (Available: {remainingShares || 0} shares)
            </span>
          </div>
          <div className={styles.quantityControl}>
            <p>
              Talkaya: (₹{headPrice})
              <br />{" "}
              <span>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Repellat ab sit voluptate quis harum veniam?
              </span>
            </p>
            <div className={styles.quantityLabels}>
              <div className={styles.quantityButtons}>
                <button
                  onClick={() => handleDecrement(setHeadQuantity, headQuantity)}
                >
                  -
                </button>
                <input type="text" value={headQuantity} readOnly />
                <button
                  onClick={() =>
                    handleIncrement(
                      setHeadQuantity,
                      headAvailability,
                      headQuantity
                    )
                  }
                  disabled={headLegsBrainQuantity > 0}
                >
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
            <p>
              Kaalu: (₹{legsPrice}) <br />{" "}
              <span>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Repellat ab sit voluptate quis harum veniam?
              </span>
            </p>
            <div className={styles.quantityLabels}>
              <div className={styles.quantityButtons}>
                <button
                  onClick={() => handleDecrement(setLegsQuantity, legsQuantity)}
                >
                  -
                </button>
                <input type="text" value={legsQuantity} readOnly />
                <button
                  onClick={() =>
                    handleIncrement(
                      setLegsQuantity,
                      legsAvailability,
                      legsQuantity
                    )
                  }
                  disabled={headLegsBrainQuantity > 0}
                >
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
            <p>
              Brain: (₹{brainPrice}) <br />{" "}
              <span>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Repellat ab sit voluptate quis harum veniam?
              </span>
            </p>
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
                <button
                  onClick={() =>
                    handleIncrement(
                      setBrainQuantity,
                      brainAvailability,
                      brainQuantity
                    )
                  }
                  disabled={headLegsBrainQuantity > 0}
                >
                  +
                </button>
              </div>
              <span>₹ {brainPrice * brainQuantity}/-</span>
            </div>
            <span className={styles.availableNote}>
              (Available: {brainAvailability || 0} )
            </span>
          </div>
          <div className={styles.quantityControl}>
            <p>
              Boti: (₹{botiShareCost}) <br />{" "}
              <span>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Repellat ab sit voluptate quis harum veniam?
              </span>
            </p>
            <div className={styles.quantityLabels}>
              <div className={styles.quantityButtons}>
                <button
                  onClick={() => handleDecrement(setBotiQuantity, botiQuantity)}
                >
                  -
                </button>
                <input type="text" value={botiQuantity} readOnly />
                <button
                  onClick={() =>
                    handleIncrement(
                      setBotiQuantity,
                      remainingBotiShares,
                      botiQuantity
                    )
                  }
                >
                  +
                </button>
              </div>
              <span>₹ {botiShareCost * botiQuantity}/-</span>
            </div>
            <span className={styles.availableNote}>
              (Available : {remainingBotiShares} shares)
            </span>
          </div>
          <div className={styles.quantityControl}>
            <p>
              Extras: (₹{extraCost}) <br />{" "}
              <span>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Repellat ab sit voluptate quis harum veniam?
              </span>
            </p>
            <div className={styles.quantityLabels}>
              <div className={styles.quantityButtons}>
                <button
                  onClick={() =>
                    handleDecrement(setExtrasQuantity, extrasQuantity)
                  }
                >
                  -
                </button>
                <input type="text" value={extrasQuantity} readOnly />
                <button
                  onClick={() =>
                    handleIncrement(
                      setExtrasQuantity,
                      extrasAvailability,
                      extrasQuantity
                    )
                  }
                >
                  +
                </button>
              </div>
              <span>₹ {extraCost * extrasQuantity}/-</span>
            </div>
            <span className={styles.availableNote}>
              (Available : {extrasAvailability} sets)
            </span>
          </div>

          {/* Add to Cart Button */}
          <div className={styles.addToCartWrap}>
            <button
              className={styles.addToCartButton}
              onClick={() => {
                updateCart(meat);
              }}
            >
              {addedToCart ? "Added" : "Add Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tile;
