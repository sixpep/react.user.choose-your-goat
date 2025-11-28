import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./UserOrders.module.css";
import { Context } from "../../App";
import { db } from "../../firebase/setup";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

function UserOrders() {
  const navigate = useNavigate();
  const { userId } = useContext(Context);
  console.log(userId);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const q = query(collection(db, "orders"), where("userId", "==", userId), orderBy("createdAt", "desc"));

        const snap = await getDocs(q);
        const list = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setOrders(list);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch orders", err);
        setError("Could not load your orders. Please try again.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const handleBack = () => {
    navigate("/home");
  };

  const formatDate = (ts) => {
    if (!ts) return "-";
    // Firestore Timestamp -> Date
    const date = ts.toDate && typeof ts.toDate === "function" ? ts.toDate() : new Date(ts);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusLabel = (status) => {
    if (!status) return "Pending";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getOrderTitle = (order) => {
    if (!order.items || order.items.length === 0) return "No items";
    const first = order.items[0];
    if (order.items.length === 1) return first.title;
    return `${first.title} + ${order.items.length - 1} more`;
  };

  const getShortId = (id) => {
    if (!id) return "";
    if (id.length <= 6) return id;
    return id.slice(-6).toUpperCase();
  };

  const hasOrders = orders.length > 0;

  if (!userId) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <button className={styles.backBtn} onClick={handleBack}>
            ←
          </button>
          <div className={styles.headerTitleBlock}>
            <div className={styles.headerTitle}>My Orders</div>
          </div>
        </header>
        <div className={styles.infoBlock}>
          <p>You need to login to view your orders.</p>
          <button className={styles.primaryBtn} onClick={() => navigate("/login")}>
            Go to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={handleBack}>
          ←
        </button>
        <div className={styles.headerTitleBlock}>
          <div className={styles.headerTitle}>My Orders</div>
          <div className={styles.headerSubtitle}>{hasOrders ? `${orders.length} order${orders.length > 1 ? "s" : ""}` : "No orders yet"}</div>
        </div>
      </header>

      {loading && <div className={styles.infoBlock}>Loading your orders...</div>}

      {error && <div className={styles.errorText}>{error}</div>}

      {!loading && !hasOrders && !error && (
        <div className={styles.infoBlock}>
          <p>You haven&apos;t placed any orders yet.</p>
          <button className={styles.primaryBtn} onClick={() => navigate("/home")}>
            Start ordering
          </button>
        </div>
      )}

      {!loading && hasOrders && (
        <div className={styles.listWrapper}>
          {orders.map((order) => (
            <div key={order.id} className={styles.card}>
              <div className={styles.cardTopRow}>
                <div>
                  <div className={styles.orderId}>Order #{getShortId(order.id)}</div>
                  <div className={styles.orderTitle}>{getOrderTitle(order)}</div>
                </div>
                <span className={`${styles.statusBadge} ${styles[`status_${order.status || "pending"}`]}`}>{getStatusLabel(order.status)}</span>
              </div>

              <div className={styles.cardMiddleRow}>
                <div className={styles.orderMeta}>{formatDate(order.createdAt)}</div>
                <div className={styles.orderMeta}>{order.deliveryPincode ? `Pincode: ${order.deliveryPincode}` : ""}</div>
              </div>

              <div className={styles.cardBottomRow}>
                <div className={styles.totalBlock}>
                  <span className={styles.totalLabel}>Total</span>
                  <span className={styles.totalValue}>₹{order.cartTotal}</span>
                </div>
                <div className={styles.itemsCount}>
                  {order.cartCount} item
                  {order.cartCount > 1 ? "s" : ""}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserOrders;
