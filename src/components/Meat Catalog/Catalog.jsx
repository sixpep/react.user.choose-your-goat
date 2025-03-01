import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { BsHandbag } from "react-icons/bs";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/setup";
import styles from "./Catalog.module.css";
import CheckOutForm from "./Check Out Form/CheckOutForm";
import TileCarousel from "./Carousel/TileCarousel";
import PopupModal from "../Modals/PopupModal";
import { Context } from "../../App";

const Catalog = () => {
  const navigate = useNavigate();
  const { order, setOrder } = useContext(Context);
  const [showCheckOutForm, setShowCheckOutForm] = useState(false);
  const [showFutureGoatPopup, setShowFutureGoatPopup] = useState(false);
  const [nextGoatDate, setNextGoatDate] = useState(null);
  const { goatsData } = useContext(Context);

  useEffect(() => {
    const fetchNextGoatDate = async () => {
      try {
        const now = Date.now();
        const docRef = doc(db, "futureGoatConfig", "nextGoat");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const futureGoatTimestamp = data.nextGoatTimeStamp;
          const showPopup = data.showNextGoatPopup;

          if (showPopup === true && futureGoatTimestamp > now) {
            const nextDate = new Date(futureGoatTimestamp);
            const formattedDate = nextDate
              .toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                hour12: true,
              })
              .replace(":00", "");

            setNextGoatDate(formattedDate);
            setShowFutureGoatPopup(true);
          }
        }
      } catch (error) {
        console.error("Error fetching next goat date:", error);
      }
    };

    fetchNextGoatDate();
  }, []);

  return (
    <div className={styles.container}>
      {showFutureGoatPopup && nextGoatDate && (
        <div className={styles.nextGoatPopup}>
          <PopupModal
            title="Next Goat Arriving Soon!"
            description="🌟 The Wait is Almost Over! 🌟 Our next premium goat will be available on "
            nextDate={nextGoatDate}
            setShowFutureGoatPopup={setShowFutureGoatPopup}
          />
        </div>
      )}

      {goatsData.length === 0 ? <p>Fetching goats, please wait ...</p> : <TileCarousel order={order} setOrder={setOrder} />}

      <div className={styles.checkOutWrap}>
        <p>
          Total Price: <span> ₹ {order.totalBill}</span>
        </p>
        <button onClick={() => navigate("/cart")} disabled={order.totalBill <= 0} style={{ opacity: order.meatRequirements.length < 1 ? 0.5 : 1 }}>
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
