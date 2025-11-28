import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SelectAddressPage.module.css";
import { Context } from "../../App";
import { db } from "../../firebase/setup";
import { collection, getDocs, query, where, addDoc, serverTimestamp, deleteDoc, doc } from "firebase/firestore";

function SelectAddressPage() {
  const navigate = useNavigate();
  const { userId, cart, cartCount, cartTotal, deliveryLocation, clearCart } = useContext(Context);

  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const q = query(collection(db, "addresses"), where("userId", "==", userId));
        const snap = await getDocs(q);
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        setAddresses(list);

        // preselect default or first
        const defaultAddr = list.find((a) => a.isDefault);
        if (defaultAddr) {
          setSelectedId(defaultAddr.id);
        } else if (list.length > 0) {
          setSelectedId(list[0].id);
        }

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch addresses", err);
        setError("Failed to load addresses");
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [userId]);

  const handleBack = () => {
    navigate("/cart");
  };

  const handleAddNew = () => {
    navigate("/add-address");
  };

  const selectedAddress = addresses.find((a) => a.id === selectedId) || null;

  const handlePlaceOrder = async () => {
    if (!selectedAddress || cartCount === 0) return;

    try {
      setPlacingOrder(true);
      setError("");

      const orderDoc = {
        userId,
        items: cart.items,
        cartTotal,
        cartCount,
        deliveryPincode: deliveryLocation,
        deliveryAddress: {
          fullName: selectedAddress.fullName,
          phoneNumber: selectedAddress.phoneNumber,
          line1: selectedAddress.line1,
          line2: selectedAddress.line2 || "",
          area: selectedAddress.area,
          landmark: selectedAddress.landmark || "",
          pincode: selectedAddress.pincode,
          geo: selectedAddress.geo,
        },
        status: "pending",
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "orders"), orderDoc);

      clearCart();
      navigate("/home");
      alert("Order placed successfully!");
    } catch (err) {
      console.error("Failed to place order", err);
      setError("Could not place order. Please try again.");
      setPlacingOrder(false);
    }
  };

  const hasAddresses = addresses.length > 0;

  const handleDeleteAddress = async (addrId) => {
    const confirmDelete = window.confirm("Delete this address?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "addresses", addrId));
      setAddresses((prev) => prev.filter((a) => a.id !== addrId));

      if (selectedId === addrId) {
        // if we deleted the selected one, reset selection
        const remaining = addresses.filter((a) => a.id !== addrId);
        const defaultAddr = remaining.find((a) => a.isDefault);
        if (defaultAddr) {
          setSelectedId(defaultAddr.id);
        } else if (remaining.length > 0) {
          setSelectedId(remaining[0].id);
        } else {
          setSelectedId(null);
        }
      }
    } catch (err) {
      console.error("Failed to delete address", err);
      setError("Could not delete address. Please try again.");
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={handleBack}>
          ←
        </button>
        <div className={styles.headerTitleBlock}>
          <div className={styles.headerTitle}>Choose delivery address</div>
          <div className={styles.headerSubtitle}>Delivering to pincode {deliveryLocation || "-"}</div>
        </div>
      </header>

      {loading && <div className={styles.infoText}>Loading your addresses...</div>}

      {!loading && !hasAddresses && (
        <div className={styles.emptyState}>
          <p>No saved addresses yet.</p>
          <button className={styles.primaryBtn} onClick={handleAddNew}>
            Add new address
          </button>
        </div>
      )}

      {!loading && hasAddresses && (
        <>
          <div className={styles.addressList}>
            {addresses.map((addr) => (
              <div key={addr.id} className={`${styles.addressCard} ${addr.id === selectedId ? styles.addressCardSelected : ""}`} onClick={() => setSelectedId(addr.id)}>
                <div className={styles.addressTopRow}>
                  <div className={styles.addressName}>{addr.fullName}</div>
                  <div className={styles.addressActions}>
                    {addr.isDefault && <span className={styles.defaultTag}>Default</span>}
                    <button
                      className={styles.addressActionBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAddress(addr.id);
                      }}
                    >
                      Delete
                    </button>
                    <button
                      className={styles.addressActionBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/edit-address/${addr.id}`);
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
                <div className={styles.addressText}>
                  {addr.line1}
                  {addr.line2 ? `, ${addr.line2}` : ""}
                </div>
                <div className={styles.addressText}>
                  {addr.area}, {addr.pincode}
                </div>
                {addr.landmark && <div className={styles.addressText}>Landmark: {addr.landmark}</div>}
              </div>
            ))}
          </div>

          <div className={styles.actionsRow}>
            <button className={styles.secondaryBtn} onClick={handleAddNew}>
              + Add new address
            </button>
          </div>
        </>
      )}

      {error && <div className={styles.errorText}>{error}</div>}

      {/* Footer place order */}
      {hasAddresses && cartCount > 0 && (
        <div className={styles.footer}>
          <div className={styles.footerSummary}>
            <div className={styles.footerTotal}>₹{cartTotal}</div>
            <div className={styles.footerMeta}>
              {cartCount} item{cartCount > 1 ? "s" : ""}
            </div>
          </div>
          <button className={styles.footerBtn} onClick={handlePlaceOrder} disabled={!selectedAddress || placingOrder}>
            {placingOrder ? "Placing..." : "Deliver to this address"}
          </button>
        </div>
      )}
    </div>
  );
}

export default SelectAddressPage;
