import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./AddAddressPage.module.css"; // reuse same styles
import { Context } from "../../App";
import { db } from "../../firebase/setup";
import { doc, getDoc, query, where, getDocs, updateDoc, collection } from "firebase/firestore";

function EditAddressPage() {
  const navigate = useNavigate();
  const { addressId } = useParams();
  const { userId, deliveryLocation, locationMeta, userProfile } = useContext(Context);

  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [area, setArea] = useState("");
  const [landmark, setLandmark] = useState("");
  const [geo, setGeo] = useState(null);
  const [isDefault, setIsDefault] = useState(false);
  const [originalIsDefault, setOriginalIsDefault] = useState(false);

  const [placingForSomeoneElse, setPlacingForSomeoneElse] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const areas = locationMeta?.areas || [];

  useEffect(() => {
    const loadAddress = async () => {
      if (!userId) {
        setError("Please login to edit address.");
        setLoading(false);
        return;
      }

      try {
        const ref = doc(db, "addresses", addressId);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setError("Address not found.");
          setLoading(false);
          return;
        }

        const data = snap.data();

        if (data.userId !== userId) {
          setError("You are not allowed to edit this address.");
          setLoading(false);
          return;
        }

        setFullName(data.fullName || "");
        setPhoneNumber(data.phoneNumber || "");
        setLine1(data.line1 || "");
        setLine2(data.line2 || "");
        setArea(data.area || "");
        setLandmark(data.landmark || "");
        setGeo(data.geo || null);
        setIsDefault(!!data.isDefault);
        setOriginalIsDefault(!!data.isDefault);

        // If existing name/phone differ from userProfile, assume "someone else"
        if (userProfile && (data.fullName !== userProfile.name || data.phoneNumber !== userProfile.phone)) {
          setPlacingForSomeoneElse(true);
        }

        setLoading(false);
      } catch (err) {
        console.error("Failed to load address", err);
        setError("Failed to load address.");
        setLoading(false);
      }
    };

    loadAddress();
  }, [addressId, userId, userProfile]);

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

  const canSave = fullName.trim() && phoneNumber.trim() && line1.trim() && area && geo && typeof geo.lat === "number" && typeof geo.lng === "number";

  const handleSave = async () => {
    if (!canSave || saving) return;

    try {
      setSaving(true);
      setError("");

      // If now default but wasn't before → unset old default(s)
      if (isDefault && !originalIsDefault) {
        const q = query(collection(db, "addresses"), where("userId", "==", userId), where("isDefault", "==", true));
        const snap = await getDocs(q);
        for (const d of snap.docs) {
          if (d.id !== addressId) {
            await updateDoc(doc(db, "addresses", d.id), {
              isDefault: false,
            });
          }
        }
      }

      const ref = doc(db, "addresses", addressId);

      await updateDoc(ref, {
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        line1: line1.trim(),
        line2: line2.trim(),
        area,
        landmark: landmark.trim(),
        // keep existing pincode if any; else fall back to deliveryLocation
        pincode: deliveryLocation || (await (await getDoc(ref)).data()).pincode,
        geo,
        isDefault,
      });

      navigate("/select-address");
    } catch (err) {
      console.error("Failed to update address", err);
      setError("Could not save changes. Please try again.");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.formWrapper}>
          <p style={{ fontSize: 14, color: "#6b7280" }}>Loading address details...</p>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className={styles.page}>
        <div className={styles.formWrapper}>
          <p style={{ fontSize: 14, marginBottom: 8 }}>Please login to edit address.</p>
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
          <div className={styles.headerTitle}>Edit address</div>
          <div className={styles.headerSubtitle}>
            Pincode: {/* show from existing address, not forced from delivery */}
            {deliveryLocation || "current address pincode"}
          </div>
        </div>
      </header>

      <div className={styles.formWrapper}>
        <label className={styles.checkboxField}>
          <input type="checkbox" checked={placingForSomeoneElse} onChange={(e) => setPlacingForSomeoneElse(e.target.checked)} />
          <span>Placing order for someone else</span>
        </label>

        <label className={styles.field}>
          <span>Full name</span>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Recipient name" disabled={!placingForSomeoneElse && !!userProfile} />
        </label>

        <label className={styles.field}>
          <span>Phone number</span>
          <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="10-digit mobile" disabled={!placingForSomeoneElse && !!userProfile} />
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
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}

export default EditAddressPage;
