import React, { useContext, useEffect, useState } from "react";
import styles from "./Tile.module.css";
import Carousel from "../Carousel/Carousel";
import { FaInfoCircle } from "react-icons/fa";
import { BsFillCaretLeftFill, BsFillCaretRightFill } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { Context } from "../../../App";
import { LuMoveLeft } from "react-icons/lu";
import { motion } from "framer-motion";

const Tile = ({
  docId,
  goatImage,
  gender,
  netWeight,
  meatOnlyWeight,
  totalShares,
  totalKeemaShares,
  approxShareSize,
  muttonShareCost,
  keemaShareCost,
  cutSize,
  headPrice,
  legsPrice,
  brainPrice,
  extraCost,
  botiShareCost,
  deliveryDateTimestamp,
  remainingBotiShares,
  remainingBrains,
  remainingMuttonShares,
  remainingKeemaShares,
  remainingHeads,
  remainingLegs,
  handlePrev,
  handleNext,
  status,
  isActive,
  totalHeads,
  totalLegs,
  totalBrains,
  totalExtras,
  totalBotiShares,
  headLegsBrainPrice,
  headLegsBrainAvailability,
  remainingExtras,
  nextUnlockText,
}) => {
  const [goatDescriptionVisible, setGoatDescriptionVisible] = useState(false);
  const { order, setOrder, goatsData } = useContext(Context);

  const currentGoatDoc = order.meatRequirements.find((item) => item.goatId === docId);

  const {
    numberOfMuttonShares = 0,
    numberOfKeemaShares = 0,
    numberOfHeadLegsBrainShares = 0,
    numberOfHeadShares = 0,
    numberOfLegsShares = 0,
    numberOfBrainShares = 0,
    numberOfBotiShares = 0,
    numberOfExtras = 0,
  } = currentGoatDoc || {};

  const handleIncrement = (keyName, availability) => {
    if (availability === 0 || isActive === false) return;
    if (currentGoatDoc) {
      const currentValue = currentGoatDoc[keyName] || 0;

      if (currentGoatDoc[keyName] && currentGoatDoc[keyName] < availability) {
        setOrder((prev) => ({
          ...prev,
          meatRequirements: prev.meatRequirements.map((item) => (item.goatId === docId ? { ...item, [keyName]: currentValue + 1 } : item)),
        }));
      } else if (!currentGoatDoc[keyName]) {
        setOrder((prev) => ({
          ...prev,
          meatRequirements: prev.meatRequirements.map((item) => (item.goatId === docId ? { ...item, [keyName]: 1 } : item)),
        }));
      }
    } else {
      setOrder((prev) => ({
        ...prev,
        meatRequirements: [...prev.meatRequirements, { goatId: docId, [keyName]: 1 }],
      }));
    }
  };

  const handleDecrement = (keyName) => {
    if (currentGoatDoc && currentGoatDoc[keyName]) {
      const currentValue = currentGoatDoc[keyName];
      const newValue = currentValue - 1;
      if (newValue > 0) {
        setOrder((prev) => ({
          ...prev,
          meatRequirements: prev.meatRequirements.map((item) => (item.goatId === docId ? { ...item, [keyName]: currentValue - 1 } : item)),
        }));
      } else {
        setOrder((prev) => ({
          ...prev,
          meatRequirements: prev.meatRequirements.map((item) => {
            if (item.goatId === docId) {
              const { [keyName]: removedKey, ...rest } = item;
              return rest;
            }
            return item;
          }),
        }));

        setOrder((prev) => ({
          ...prev,
          meatRequirements: prev.meatRequirements.filter((item) => {
            return !(Object.keys(item).length < 2);
          }),
        }));
      }
    }
  };

  const handleDeliveryDate = (timestamp) => {
    const options = { weekday: "long", month: "short", day: "numeric" };
    return new Date(timestamp).toLocaleDateString("en-US", options);
  };

  const handleShowGoatInfo = () => {
    setGoatDescriptionVisible(!goatDescriptionVisible);
  };

  useEffect(() => {
    var updatedBill =
      numberOfMuttonShares * muttonShareCost +
      numberOfHeadShares * headPrice +
      numberOfLegsShares * legsPrice +
      numberOfBrainShares * brainPrice +
      numberOfBotiShares * botiShareCost +
      numberOfExtras * extraCost;

    if (keemaShareCost) {
      updatedBill += numberOfKeemaShares * keemaShareCost;
    }

    setOrder((prevOrder) => ({
      ...prevOrder,
      totalBill: updatedBill,
    }));
  }, [numberOfMuttonShares, numberOfKeemaShares, numberOfHeadShares, numberOfLegsShares, numberOfBrainShares, numberOfBotiShares, numberOfExtras]);

  return (
    <div className={styles.container}>
      {goatDescriptionVisible && (
        <div className={styles.descriptionPopupOverlay}>
          <div className={styles.descriptionTable}>
            <i className={styles.closeIcon} onClick={() => setGoatDescriptionVisible(false)}>
              <RxCross2 color="black" size={24} />
            </i>
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
                  <td>₹ {muttonShareCost}/-</td>
                </tr>
                <tr>
                  <td>Size</td>
                  <td>:</td>
                  <td>{cutSize}</td>
                </tr>
                {/* <tr>
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
                </tr> */}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.backBar}>
          <div className={styles.backBtn} onClick={() => (window.location.pathname = "/home")}>
            <i>
              <LuMoveLeft size={20} />
            </i>
          </div>
        </div>
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
          {/* <div className={styles.greeting}>
            <p>
              Hello <span>Meat Lover</span>
              <img src="/images/handWaveSymbol.png" alt="" />
            </p>
            <p>It's Meat Time!</p>
          </div> */}
          <div className={styles.headerTitle}>
            <h6>
              Fresh <br />
              Goat Meat{" "}
              <div className={styles.iconWrap}>
                <img src="/images/muttonIcon.png" alt="" />
              </div>
            </h6>
          </div>
          <div className={styles.deliveryDateWrap}>
            <p> Delivery by</p>
            <span>{handleDeliveryDate(deliveryDateTimestamp)}</span>
          </div>
        </div>
        <div className={styles.tileImage}>
          <Carousel images={[goatImage]} goatDescriptionVisible={goatDescriptionVisible} />
          <i onClick={handleShowGoatInfo}>
            <FaInfoCircle color="white" size={20} style={{ zIndex: "100" }} />
          </i>
        </div>
        {goatsData.length > 1 && (
          <div className={styles.tileCarouselBtns}>
            <button
              type="button"
              className="relative flex justify-center h-min cursor-pointer group focus:outline-none"
              data-carousel-prev
              onClick={handlePrev}
              style={{
                visibility: goatDescriptionVisible || goatsData.length < 2 ? "hidden" : "visible",
              }}
            >
              <i className="inline-flex items-center justify-center w-10 h-10" style={{ zIndex: 5 }}>
                <BsFillCaretLeftFill size={30} style={{ zIndex: "5" }} />
              </i>
            </button>

            <button
              type="button"
              className="relative flex justify-center h-min cursor-pointer group focus:outline-none"
              data-carousel-next
              onClick={handleNext}
              style={{
                visibility: goatDescriptionVisible || goatsData.length < 2 ? "hidden" : "visible",
              }}
            >
              <i className="inline-flex items-center justify-center w-10 h-10 ">
                <BsFillCaretRightFill size={30} />
              </i>
            </button>
          </div>
        )}

        <div className={styles.goatDetails}>
          {/* Interactive Quantity Controls */}
          <div className={styles.quantityControl}>
            <div className={styles.label}>
              <div className={styles.itemLabelWrap}>
                <p>Mutton</p>
                <span className={styles.availableNote}>
                  Available Shares :{" "}
                  <span>
                    {!isActive ? 0 : remainingMuttonShares || 0}/{totalShares}
                  </span>
                </span>
              </div>
            </div>
            <span>Each share weighs between 480 and 520 grams and includes one nalli, liver, and all cuts of the meat.</span>

            <div className={styles.controlPrices}>
              <div className={styles.price}>
                <p>
                  ₹ {muttonShareCost} <span>/500g</span>
                </p>
                {/* <p>₹ {muttonShareCost * numberOfMuttonShares}</p> */}
              </div>
              <div
                className={styles.quantityButtons}
                style={{
                  opacity: remainingMuttonShares < 1 || !isActive ? 0.5 : 1,
                }}
              >
                <button onClick={() => handleDecrement("numberOfMuttonShares")}>-</button>
                <p>{numberOfMuttonShares || 0}</p>
                {/* <input
                  type="text"
                  id="numberOfMuttonShares"
                  readOnly
                  value={numberOfMuttonShares || 0}
                /> */}
                <button onClick={() => handleIncrement("numberOfMuttonShares", remainingMuttonShares)}>+</button>
              </div>
            </div>

            {/* <div className={styles.quantityLabels}>
              <span>₹ {muttonShareCost * muttonQuantity}/-</span>
            </div> */}
            {/* <span
              className={styles.availableNote}
              style={{ color: remainingMuttonShares > 0 ? "green" : "red" }}
            >
              (Available: {remainingMuttonShares || 0} shares)
            </span> */}
          </div>

          {totalKeemaShares ? (
            <div className={styles.quantityControl}>
              <div className={styles.label}>
                <div className={styles.itemLabelWrap}>
                  <p>Keema</p>
                  <span className={styles.availableNote}>
                    Available Shares :{" "}
                    <span>
                      {!isActive ? 0 : remainingKeemaShares || 0}
                      {totalKeemaShares ? `/${totalKeemaShares}` : ""}
                    </span>
                  </span>
                </div>
              </div>
              <span>100% Boneless</span>

              <div className={styles.controlPrices}>
                <div className={styles.price}>
                  <p>
                    ₹ {keemaShareCost} <span>/250g</span>
                  </p>
                </div>
                <div
                  className={styles.quantityButtons}
                  style={{
                    opacity: remainingKeemaShares < 1 || !isActive ? 0.5 : 1,
                  }}
                >
                  <button onClick={() => handleDecrement("numberOfKeemaShares")}>-</button>
                  <p>{numberOfKeemaShares || 0}</p>
                  <button onClick={() => handleIncrement("numberOfKeemaShares", remainingKeemaShares)}>+</button>
                </div>
              </div>
            </div>
          ) : (
            <div></div>
          )}

          {nextUnlockText && (
            <div className={styles.unlockingNote}>
              <p>{nextUnlockText} </p>
            </div>
          )}

          <div className={styles.quantityControl}>
            <div className={styles.label}>
              <div className={styles.itemLabelWrap}>
                <p>Head (తలకాయ) </p>
                {/* <p>Goat Head</p> */}
                <span className={styles.availableNote}>
                  Available Shares :{" "}
                  <span>
                    {!isActive ? 0 : remainingHeads || 0}
                    {totalHeads ? `/${totalHeads}` : ""}
                  </span>
                </span>
              </div>
            </div>
            <div className={styles.controlPrices}>
              <div className={styles.price}>
                <p>
                  ₹ {headPrice} <span>/1pc</span>
                </p>
                {/* <p>₹ {headPrice * numberOfHeadShares}</p> */}
              </div>
              <div
                className={styles.quantityButtons}
                style={{
                  opacity: remainingHeads < 1 || !isActive ? 0.5 : 1,
                }}
              >
                <button onClick={() => handleDecrement("numberOfHeadShares")}>-</button>
                {/* <input type="text" readOnly value={numberOfHeadShares || 0} /> */}
                <p>{numberOfHeadShares || 0}</p>
                <button onClick={() => handleIncrement("numberOfHeadShares", remainingHeads)}>+</button>
              </div>
            </div>
            {/* <span>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellat
              ab sit voluptate quis harum veniam?
            </span> */}
            {/* <div className={styles.quantityLabels}>
              <span>₹ {headPrice * headQuantity}/-</span>
            </div> */}
            {/* <span
              className={styles.availableNote}
              style={{ color: remainingHeads > 0 ? "green" : "red" }}
            >
              (Available: {remainingHeads || 0} share)
            </span> */}
          </div>

          <div className={styles.quantityControl}>
            <div className={styles.label}>
              <div className={styles.itemLabelWrap}>
                <p>Legs (కాలు)</p>
                {/* <p>Goat Legs</p> */}
                <span className={styles.availableNote}>
                  Available Shares :{" "}
                  <span>
                    {!isActive ? 0 : remainingLegs || 0}
                    {totalLegs ? `/${totalLegs}` : ""}
                  </span>
                </span>
              </div>
            </div>
            <span>Each share includes four legs.</span>
            <div className={styles.controlPrices}>
              <div className={styles.price}>
                <p>
                  ₹ {legsPrice} <span>/4pc</span>
                </p>
                {/* <p>₹ {legsPrice * numberOfLegsShares}</p> */}
              </div>
              <div
                className={styles.quantityButtons}
                style={{
                  opacity: remainingLegs < 1 || !isActive ? 0.5 : 1,
                }}
              >
                <button onClick={() => handleDecrement("numberOfLegsShares")}>-</button>
                {/* <input type="text" readOnly value={numberOfLegsShares || 0} /> */}
                <p>{numberOfLegsShares || 0}</p>
                <button onClick={() => handleIncrement("numberOfLegsShares", remainingLegs)}>+</button>
              </div>
            </div>

            {/* <div className={styles.quantityLabels}>
              <span>₹ {legsPrice * legsQuantity}/-</span>
            </div> */}
            {/* <span
              className={styles.availableNote}
              style={{ color: remainingLegs > 0 ? "green" : "red" }}
            >
              (Available: {remainingLegs || 0} share)
            </span> */}
          </div>

          <div className={styles.quantityControl}>
            <div className={styles.label}>
              <div className={styles.itemLabelWrap}>
                <p>Brain (మెదడు)</p>
                {/* <p>Goat Brain</p> */}
                <span className={styles.availableNote}>
                  Available Shares :{" "}
                  <span>
                    {!isActive ? 0 : remainingBrains || 0}
                    {totalBrains ? `/${totalBrains}` : ""}
                  </span>
                </span>
              </div>
            </div>
            <div className={styles.controlPrices}>
              <div className={styles.price}>
                <p>
                  ₹ {brainPrice} <span>/1pc</span>
                </p>
                {/* <p>₹ {brainPrice * numberOfBrainShares}</p> */}
              </div>
              <div
                className={styles.quantityButtons}
                style={{
                  opacity: remainingBrains < 1 || !isActive ? 0.5 : 1,
                }}
              >
                <button onClick={() => handleDecrement("numberOfBrainShares")}>-</button>
                {/* <input
                    type="text"
                    readOnly
                    value={numberOfBrainShares || 0}
                  /> */}
                <p>{numberOfBrainShares || 0}</p>
                <button onClick={() => handleIncrement("numberOfBrainShares", remainingBrains)}>+</button>
              </div>
            </div>
            {/* <span>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellat
              ab sit voluptate quis harum veniam?
            </span> */}
            {/* <div className={styles.quantityLabels}>
              <span>₹ {brainPrice * brainQuantity}/-</span>
            </div> */}
            {/* <span
              className={styles.availableNote}
            >
              (Available: {remainingBrains || 0} )
            </span> */}
          </div>

          <div className={styles.quantityControl}>
            <div className={styles.label}>
              <div className={styles.itemLabelWrap}>
                <p>Boti (బోటి)</p>
                {/* <p>Goat Boti</p> */}
                <span className={styles.availableNote}>
                  Available Shares :{" "}
                  <span>
                    {!isActive ? 0 : remainingBotiShares || 0}
                    {totalBotiShares ? `/${totalBotiShares}` : ""}
                  </span>
                </span>
              </div>
            </div>
            <span>Each share of boti weighs between 650 grams to 750 grams.</span>

            <div className={styles.controlPrices}>
              <div className={styles.price}>
                <p>₹ {botiShareCost}</p>
                {/* <p>₹ {botiShareCost * numberOfBotiShares}</p> */}
              </div>
              <div
                className={styles.quantityButtons}
                style={{
                  opacity: remainingBotiShares < 1 || !isActive ? 0.5 : 1,
                }}
              >
                <button onClick={() => handleDecrement("numberOfBotiShares")}>-</button>
                {/* <input type="text" readOnly value={numberOfBotiShares || 0} /> */}
                <p>{numberOfBotiShares || 0}</p>
                <button onClick={() => handleIncrement("numberOfBotiShares", remainingBotiShares)}>+</button>
              </div>
            </div>
            {/* <div className={styles.quantityLabels}>
              <span>₹ {botiShareCost * botiQuantity}/-</span>
            </div> */}
            {/* <span
              className={styles.availableNote}
              style={{ color: remainingBotiShares > 0 ? "green" : "red" }}
            >
              (Available : {remainingBotiShares} shares)
            </span> */}
          </div>

          <div className={styles.quantityControl}>
            <div className={styles.label}>
              <div className={styles.itemLabelWrap}>
                <p>Gizzards</p>
                {/* <p>Goat Boti</p> */}
                <span className={styles.availableNote}>
                  Available Shares :{" "}
                  <span>
                    {!isActive ? 0 : remainingExtras || 0}
                    {totalExtras ? `/${totalExtras}` : ""}
                  </span>
                </span>
              </div>
            </div>
            <span>100g liver, Heart (1), Kidneys (2), Testicles (2), Tilli(1).</span>

            <div className={styles.controlPrices}>
              <div className={styles.price}>
                <p>₹ {extraCost}</p>
                {/* <p>₹ {botiShareCost * numberOfBotiShares}</p> */}
              </div>
              <div
                className={styles.quantityButtons}
                style={{
                  opacity: remainingExtras < 1 || !isActive ? 0.5 : 1,
                }}
              >
                <button onClick={() => handleDecrement("numberOfExtras")}>-</button>
                {/* <input type="text" readOnly value={numberOfBotiShares || 0} /> */}
                <p>{numberOfExtras || 0}</p>
                <button onClick={() => handleIncrement("numberOfExtras", remainingExtras)}>+</button>
              </div>
            </div>
            {/* <div className={styles.quantityLabels}>
              <span>₹ {botiShareCost * botiQuantity}/-</span>
            </div> */}
            {/* <span
              className={styles.availableNote}
              style={{ color: remainingBotiShares > 0 ? "green" : "red" }}
            >
              (Available : {remainingBotiShares} shares)
            </span> */}
          </div>

          {/* <div className={styles.quantityControl}>
            <div className={styles.label}>
              <p>Gizzards</p>
              <div className={styles.controlPrices}>
                <div
                  className={styles.quantityButtons}
                  style={{
                    opacity: remainingExtras > 0 ? 1 : 0.5,
                  }}
                >
                  <button onClick={() => handleDecrement("numberOfExtras")}>
                    -
                  </button>
                  <input type="text" readOnly value={numberOfExtras || 0} />
                  <button
                    onClick={() =>
                      handleIncrement("numberOfExtras", remainingExtras)
                    }
                  >
                    +
                  </button>
                </div>
                <div className={styles.price}>
                  <p>₹ {extraCost}</p>
                  <p>₹ {extraCost * numberOfExtras}</p>
                </div>
              </div>
            </div>
            <span>
              Kidneys, Tilli, Heart, Testicles and 2-3 pieces of liver, weighs
              around 300-400 grams
            </span>
            <div className={styles.quantityLabels}>
              <span>₹ {extraCost * extrasQuantity}/-</span>
            </div>
            <span
              className={styles.availableNote}
              style={{ color: remainingExtras > 0 ? "green" : "red" }}
            >
              (Available : {remainingExtras} share)
            </span>
          </div> */}

          {/* Add to Cart Button */}
          {/* <div className={styles.addToCartWrap}>
            <button
              className={styles.addToCartButton}
              onClick={() => {
                updateCart(meat);
              }}
            >
              {addedToCart ? "Added" : "Add Cart"}
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Tile;

//  const [muttonQuantity, setMuttonQuantity] = useState(0);
//  const [headQuantity, setHeadQuantity] = useState(0);
//  const [legsQuantity, setLegsQuantity] = useState(0);
//  const [brainQuantity, setBrainQuantity] = useState(0);
//  const [botiQuantity, setBotiQuantity] = useState(0);
//  const [extrasQuantity, setExtrasQuantity] = useState(0);
//  const [headLegsBrainQuantity, setHeadLegsBrainQuantity] = useState(0);
//  const meat = {
//    goatId: docId,
//    numberOfMuttonShares: muttonQuantity,
//    numberOfHeadLegsBrainShares: headLegsBrainQuantity,
//    numberOfHeadShares: headQuantity,
//    numberOfLegsShares: legsQuantity,
//    numberOfBrainShares: brainQuantity,
//    numberOfBotiShares: botiQuantity,
//    numberOfExtras: extrasQuantity,
//  };
//  const [addedToCart, setAddedToCart] = useState(false);
//  var extrasAvailability = 1;

//  // Handlers to control quantity increment and decrement
//  const handleIncrement = (setter, availability, quantity) => {
//    if (quantity < availability) setter((prev) => prev + 1);
//  };

//  const handleDecrement = (setter, quantity) => {
//    if (quantity > 0) {
//      setter((prev) => prev - 1);
//    }
//  };

//   const updateCart = (newRequirement) => {
//     if (
//       headQuantity === 0 &&
//       legsQuantity === 0 &&
//       brainQuantity === 0 &&
//       headLegsBrainQuantity === 0 &&
//       botiQuantity === 0 &&
//       extrasQuantity === 0
//     ) {
//       alert("No items to add to cart!");
//       return;
//     }
//     setOrder((prevOrder) => {
//       // Find the existing requirement by ID
//       const existingRequirement = prevOrder.meatRequirements.find(
//         (req) => req.goatId === newRequirement.goatId
//       );

//       if (existingRequirement) {
//         // If found, map through and update the object
//         return {
//           ...prevOrder,
//           meatRequirements: prevOrder.meatRequirements.map((req) =>
//             req.goatId === newRequirement.goatId
//               ? { ...req, ...newRequirement }
//               : req
//           ),
//         };
//       } else {
//         // If not found, add the new requirement
//         return {
//           ...prevOrder,
//           meatRequirements: [...prevOrder.meatRequirements, newRequirement],
//         };
//       }
//     });
//     console.log(order);
//   };

//   const handleQuantitychange = (e) => {
//     const { id, value } = e.target;

//     if (
//       headQuantity === 0 &&
//       legsQuantity === 0 &&
//       brainQuantity === 0 &&
//       headLegsBrainQuantity === 0 &&
//       botiQuantity === 0 &&
//       extrasQuantity === 0
//     ) {
//       setOrder((prevOrder) => ({
//         ...prevOrder,
//         meatRequirements: prevOrder.meatRequirements.filter(
//           (item) => item.goatId === docId
//         ),
//       }));
//     } else {
//       setOrder((prevOrder) => {
//         const existingIndex = prevOrder.meatRequirements.findIndex(
//           (item) => item.goatId === docId
//         );

//         if (existingIndex !== -1) {
//           // Update existing item
//           const updatedRequirements = [...prevOrder.meatRequirements];
//           updatedRequirements[existingIndex] = meat; // Replace the existing item with the new meat object
//           return { ...prevOrder, meatRequirements: updatedRequirements };
//         } else {
//           // Add the new meat object since it doesn't exist
//           return {
//             ...prevOrder,
//             meatRequirements: [...prevOrder.meatRequirements, meat],
//           };
//         }
//       });
//     }

//     console.log("order quantiy : ", order);
//   };

//   useEffect(() => {
//     const updatedBill =
//       muttonQuantity * muttonShareCost +
//       headQuantity * headPrice +
//       legsQuantity * legsPrice +
//       brainQuantity * brainPrice +
//       headLegsBrainQuantity * headLegsBrainPrice +
//       botiQuantity * botiShareCost +
//       extrasQuantity * extraCost;

//     setOrder((prevOrder) => ({
//       ...prevOrder,
//       totalBill: updatedBill,
//     }));
//     console.log("order variable in catalog", order);
//   }, [
//     muttonQuantity,
//     headQuantity,
//     legsQuantity,
//     brainQuantity,
//     headLegsBrainQuantity,
//     botiQuantity,
//     extrasQuantity,
//   ]);
