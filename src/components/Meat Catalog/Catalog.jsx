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

  useEffect(() => {
    const fetchNextGoatDate = async () => {
      try {
        // Get today's timestamp at midnight (00:00:00)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayTimestamp = today.getTime();

        // Check if any existing goat has a future delivery date
        const goatsRef = collection(db, "goats");
        const q = query(goatsRef, where("deliveryDateTimestamp", ">=", todayTimestamp));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.docs.length === 0) {
          // Fetch next goat timestamp from Firestore
          const docRef = doc(db, "futureGoatConfig", "nextGoat");
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const futureGoatTimestamp = docSnap.data().nextGoatTimeStamp;

            // Convert Firestore timestamp to formatted date
            const nextDate = new Date(futureGoatTimestamp);
            const formattedDate = nextDate.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            });

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

      <TileCarousel order={order} setOrder={setOrder} />

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
