import React, { useContext, useEffect, useState } from "react";
import styles from "./UserProfile.module.css";
import { Context } from "../../App";
import { LuMoveLeft } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

import { assignReferralCodesToAllUsers } from "../../utils/referalCodeGeneration.utils";

const MOBILE_BREAKPOINT = 768;

const UserProfile = () => {
  const navigate = useNavigate();
  const { order } = useContext(Context); // adjust if you manage auth in Context
  const [userLoggedIn, setUserLoggedIn] = useState(true);
  const [isMobileView, setIsMobileView] = useState(typeof window !== "undefined" && window.innerWidth <= MOBILE_BREAKPOINT);
  const [copyStatus, setCopyStatus] = useState("");
  const [shareError, setShareError] = useState("");
  const [referrerDetails, setReferrerDetails] = useState({});

  const userName = order?.userName || "";
  const userPhoto = order?.photoURL || "/images/userIcon_96x96.png";
  const referralCode = order?.referralCode || "";

  useEffect(() => {
    if (localStorage.getItem("choose-your-goat-token")) {
      setUserLoggedIn(true);
    } else {
      setUserLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= MOBILE_BREAKPOINT);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleShareReferral = async () => {
    setShareError("");

    if (!navigator.share) {
      // optional: fallback to copy
      // handleCopyReferral();
      setShareError("Sharing is not supported on this device.");
      return;
    }

    try {
      await navigator.share({
        title: "Join Choose Your Goat",
        text: `Use my referral code ${referralCode} to join Choose Your Goat!`,
        url: window.location.origin,
      });
    } catch (error) {
      setShareError("Could not share referral code.");
    }
  };

  const handleCopyReferral = async () => {
    setCopyStatus("");

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(referralCode);
      } else {
        const textField = document.createElement("textarea");
        textField.innerText = referralCode;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand("copy");
        textField.remove();
      }
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus(""), 2000);
    } catch (error) {
      setCopyStatus("Failed to copy");
      setTimeout(() => setCopyStatus(""), 2000);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUserLoggedIn(false);
    //using href instead of navigate() so that we get a reloaded page.
    // navigate("/");
    window.location.href = "/";
  };

  return (
    <div className={styles.container}>
      <div className={styles.backBar}>
        <div className={styles.backBtn} onClick={() => navigate("/")}>
          <i>
            <LuMoveLeft size={20} />
          </i>
          <p>Back</p>
        </div>
      </div>

      {userLoggedIn ? (
        <div className={styles.profileContent}>
          {/* User basic info */}
          <div className={styles.userInfo}>
            <img src={userPhoto} alt={userName} className={styles.userPhoto} />
            <div className={styles.userNameWrapper}>
              <h2 className={styles.userName}>{userName}</h2>
              {order?.userPhoneNumber && <p className={styles.userPhone}>{order.userPhoneNumber}</p>}
            </div>
          </div>

          {/* Referral code section */}
          <div className={styles.referralSection}>
            <div className={styles.referralRow}>
              <p className={styles.referralLabel}>Your referral code:</p>
              <p className={styles.referralCode}>{referralCode}</p>
            </div>

            {/* Button below the code row */}
            <div className={styles.referralButtonContainer}>
              {isMobileView ? (
                <button className={styles.referralActionBtn} onClick={handleShareReferral}>
                  📱 Share referral code
                </button>
              ) : (
                <button className={styles.referralActionBtn} onClick={handleCopyReferral}>
                  📋 Copy referral code
                </button>
              )}
            </div>

            <div className={styles.referralButtonContainer}>
              {copyStatus && <p className={styles.referralMessage}>{copyStatus}</p>}
              {shareError && <p className={styles.referralMessageError}>{shareError}</p>}
            </div>
          </div>

          {/* Logout button at bottom */}
          {/* <button className={styles.logoutBtn} onClick={assignReferralCodesToAllUsers}>
            assign referral
          </button> */}
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <p style={{ textAlign: "center", margin: "2rem 0" }}>Please login to see your profile!</p>
      )}
    </div>
  );
};

export default UserProfile;
