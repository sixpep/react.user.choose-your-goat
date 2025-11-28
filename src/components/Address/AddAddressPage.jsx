import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AddAddressPage.module.css";
import { Context } from "../../App";
import { db } from "../../firebase/setup";
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

function AddAddressPage() {
  const navigate = useNavigate();
  const { userId, userProfile, deliveryLocation, locationMeta } = useContext(Context);

  const [fullName, setFullName] = useState(userProfile?.name || "");
  const [phoneNumber, setPhoneNumber] = useState(userProfile?.phone || "");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [area, setArea] = useState("");
  const [landmark, setLandmark] = useState("");
  const [geo, setGeo] = useState(null);
  const [isDefault, setIsDefault] = useState(true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [placingForSomeoneElse, setPlacingForSomeoneElse] = useState(false);

  const areas = locationMeta?.areas || [];

  const handleBack = () => {
    navigate("/select-address");
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported on this device.");
      return;
    }

    setError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeo({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        setError("Unable to fetch your location. Please try again.");
      }
    );
  };

  const canSave = fullName.trim() && phoneNumber.trim() && line1.trim() && area && deliveryLocation && geo;

  const handleSave = async () => {
    if (!canSave || saving) return;

    try {
      setSaving(true);
      setError("");

      // if setting default, unset previous default
      if (isDefault) {
        const q = query(collection(db, "addresses"), where("userId", "==", userId), where("isDefault", "==", true));
        const snap = await getDocs(q);
        for (const d of snap.docs) {
          await updateDoc(doc(db, "addresses", d.id), {
            isDefault: false,
          });
        }
      }

      const docData = {
        userId,
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        line1: line1.trim(),
        line2: line2.trim(),
        area,
        landmark: landmark.trim(),
        pincode: deliveryLocation,
        geo,
        isDefault,
      };

      await addDoc(collection(db, "addresses"), docData);

      navigate("/select-address");
    } catch (err) {
      console.error("Failed to save address", err);
      setError("Could not save address. Please try again.");
      setSaving(false);
    }
  };

  // 🚫 If no userId, block this page and send to login
  if (!userId) {
    return (
      <div className={styles.page}>
        <div className={styles.formWrapper}>
          <p style={{ fontSize: 14, marginBottom: 8 }}>Please login to add a delivery address.</p>
          <button className={styles.saveBtn} onClick={() => navigate("/login")}>
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
          <div className={styles.headerTitle}>Add new address</div>
          <div className={styles.headerSubtitle}>Pincode: {deliveryLocation || "-"}</div>
        </div>
      </header>

      <div className={styles.formWrapper}>
        <label className={styles.field}>
          <span>Full name</span>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" disabled={!placingForSomeoneElse && !!userProfile} />
        </label>

        <label className={styles.field}>
          <span>Phone number</span>
          <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="10-digit mobile" disabled={!placingForSomeoneElse && !!userProfile} />
        </label>

        <label className={styles.checkboxField}>
          <input type="checkbox" checked={placingForSomeoneElse} onChange={(e) => setPlacingForSomeoneElse(e.target.checked)} />
          <span>Placing order for someone else</span>
        </label>

        <label className={styles.field}>
          <span>Area / Locality</span>
          <select value={area} onChange={(e) => setArea(e.target.value)}>
            <option value="">Select area</option>
            {areas.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>House / Flat / Door no.</span>
          <input value={line1} onChange={(e) => setLine1(e.target.value)} placeholder="Door / Flat / House no." />
        </label>

        <label className={styles.field}>
          <span>Street / Block / Road (optional)</span>
          <input value={line2} onChange={(e) => setLine2(e.target.value)} placeholder="Street / Block" />
        </label>

        <label className={styles.field}>
          <span>Landmark (optional)</span>
          <input value={landmark} onChange={(e) => setLandmark(e.target.value)} placeholder="Near temple, park, etc." />
        </label>

        <div className={styles.field}>
          <span>Location (required)</span>
          <button type="button" className={styles.geoBtn} onClick={handleUseCurrentLocation}>
            Use current location
          </button>
          {geo && (
            <div className={styles.geoInfo}>
              Location captured ✓ ({geo.lat.toFixed(4)}, {geo.lng.toFixed(4)})
            </div>
          )}
        </div>

        <label className={styles.checkboxField}>
          <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} />
          <span>Make this my default address</span>
        </label>

        {error && <div className={styles.errorText}>{error}</div>}

        <button className={styles.saveBtn} onClick={handleSave} disabled={!canSave || saving}>
          {saving ? "Saving..." : "Save address"}
        </button>
      </div>
    </div>
  );
}

export default AddAddressPage;
