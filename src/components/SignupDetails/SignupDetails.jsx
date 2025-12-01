import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./SignupDetails.module.css";
import { Context } from "../../App";
import { db, auth } from "../../firebase/setup";
import { collection, query, where, getDocs, doc, setDoc, serverTimestamp } from "firebase/firestore";

async function generateReferralCode(name, phone) {
  const cleanName = (name || "USER").replace(/\s+/g, "");
  const basePart = cleanName.slice(0, 3).toUpperCase();
  const phonePart = (phone || "").slice(-4);
  let base = (basePart + phonePart).replace(/[^A-Z0-9]/gi, "") || "MEAT123";

  let candidate = base;
  let isUnique = false;

  while (!isUnique) {
    const q = query(collection(db, "users"), where("myReferralCode", "==", candidate));
    const snap = await getDocs(q);
    if (snap.empty) {
      isUnique = true;
    } else {
      // collision → add random 3 digits and try again
      const suffix = Math.floor(100 + Math.random() * 900);
      candidate = base + suffix;
    }
  }

  return candidate;
}

function SignupDetails() {
  const navigate = useNavigate();
  const { userId, userProfile, setUserProfile, authChecked } = useContext(Context);

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirectTo = params.get("redirectTo") || "/home";

  // Load phone number from current Firebase user
  useEffect(() => {
    const fbUser = auth.currentUser;
    if (fbUser?.phoneNumber) {
      const raw = fbUser.phoneNumber.replace(/^\+91/, "");
      setPhoneNumber(raw);
    }
  }, []);

  // Redirect guards
  useEffect(() => {
    if (!authChecked) return;

    // not logged in → no signup
    if (!userId) {
      navigate("/login", { replace: true });
      return;
    }

    // already has profile -> no need to be here
    if (userProfile) {
      navigate("/home", { replace: true });
    }
  }, [authChecked, userId, userProfile, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const trimmedReferral = referralCode.trim().toUpperCase();

    if (!trimmedName) {
      setError("Please enter your name");
      return;
    }

    if (!phoneNumber) {
      setError("Could not detect your phone number. Please login again.");
      return;
    }

    try {
      setSaving(true);

      let referredByUserId = null;
      let referredByCode = null;

      if (trimmedReferral) {
        // Strict: referral code must exist
        const refQ = query(collection(db, "users"), where("myReferralCode", "==", trimmedReferral));
        const snap = await getDocs(refQ);

        if (snap.empty) {
          setError("Invalid referral code. Please check and try again.");
          setSaving(false);
          return;
        }

        const refDoc = snap.docs[0];
        referredByUserId = refDoc.id;
        referredByCode = trimmedReferral;
      }

      const myReferralCode = await generateReferralCode(trimmedName, phoneNumber);

      const userDocData = {
        userId,
        phoneNumber,
        name: trimmedName,
        createdAt: serverTimestamp(),
        myReferralCode,
        referredByCode,
        referredByUserId,
        referralRewardBalance: 0,
        totalOrders: 0,
      };

      await setDoc(doc(db, "users", userId), userDocData);

      // update context
      if (typeof setUserProfile === "function") {
        setUserProfile(userDocData);
      }

      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error("Failed to save signup details", err);
      setError("Could not save your details. Please try again.");
      setSaving(false);
    }
  };

  if (!authChecked) {
    return (
      <div className={styles.page}>
        <div className={styles.formWrapper}>
          <p className={styles.infoText}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate("/home")}>
          ←
        </button>
        <div className={styles.headerTitleBlock}>
          <div className={styles.headerTitle}>Complete your profile</div>
          <div className={styles.headerSubtitle}>Just one step before you enjoy True Meat</div>
        </div>
      </header>

      <div className={styles.formWrapper}>
        <div className={styles.infoBox}>
          <div className={styles.infoLabel}>Logged in as</div>
          <div className={styles.infoValue}>+91 {phoneNumber || "Unknown number"}</div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.field}>
            <span>Your name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="What should we call you?" />
          </label>

          <label className={styles.field}>
            <span>Referral code (optional)</span>
            <input value={referralCode} onChange={(e) => setReferralCode(e.target.value)} placeholder="Enter referral code if you have one" style={{ textTransform: "uppercase" }} />
          </label>

          {error && <div className={styles.errorText}>{error}</div>}

          <button type="submit" className={styles.primaryBtn} disabled={saving}>
            {saving ? "Saving..." : "Save & continue"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignupDetails;
