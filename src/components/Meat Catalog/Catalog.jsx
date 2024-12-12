import React, { useContext, useEffect, useState } from "react";
import styles from "./Catalog.module.css";
import CheckOutForm from "./Check Out Form/CheckOutForm";
import TileCarousel from "./Carousel/TileCarousel";
import { useNavigate } from "react-router-dom";
import { BsHandbag } from "react-icons/bs";
import { Context } from "../../App";

const Catalog = () => {
  const navigate = useNavigate();

  const { order, setOrder } = useContext(Context);
  const [showCheckOutForm, setShowCheckOutForm] = useState(false);

  return (
    <div className={styles.container}>
      <TileCarousel order={order} setOrder={setOrder} />
      <div className={styles.checkOutWrap}>
        <p>
          Total Price: <span> ₹ {order.totalBill}</span>
        </p>
        <button
          onClick={() => navigate("/cart")}
          disabled={order.totalBill <= 0}
          style={{
            opacity: order.meatRequirements.length < 1 ? 0.5 : 1,
          }}
        >
          <BsHandbag />
          <p>Bag</p>
        </button>
      </div>
      {showCheckOutForm && (
        <div className={styles.checkOutForm}>
          <CheckOutForm setShowCheckOutForm={setShowCheckOutForm} />
        </div>
      )}
    </div>
  );
};

export default Catalog;
