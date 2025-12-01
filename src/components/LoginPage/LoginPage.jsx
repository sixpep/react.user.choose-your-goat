import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./LoginPage.module.css";
import { auth, db } from "../../firebase/setup";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

function LoginPage() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone"); // "phone" | "otp"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [confirmationResult, setConfirmationResult] = useState(null);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirectTo = params.get("redirectTo") || "/home";

  // Clean up global recaptcha on unmount
  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  const setupRecaptcha = () => {
    if (window.recaptchaVerifier) {
      return window.recaptchaVerifier;
    }

    // Your working version style:
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });

    return window.recaptchaVerifier;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    const trimmed = phone.trim();
    if (!/^\d{10}$/.test(trimmed)) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }

    try {
      setLoading(true);
      const verifier = setupRecaptcha();
      const fullPhone = "+91" + trimmed;

      const result = await signInWithPhoneNumber(auth, fullPhone, verifier);
      setConfirmationResult(result);
      setStep("otp");
    } catch (err) {
      console.error("Error sending OTP", err);
      setError("Failed to send OTP. Please try again.");
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!confirmationResult) {
      setError("Please request OTP again.");
      setStep("phone");
      return;
    }

    if (!otp.trim()) {
      setError("Enter the OTP you received");
      return;
    }

    try {
      setLoading(true);

      // Confirm OTP (logs user into Firebase Auth)
      await confirmationResult.confirm(otp.trim());

      const fbUser = auth.currentUser;
      if (!fbUser) {
        setError("Something went wrong. Please login again.");
        setLoading(false);
        return;
      }

      const uid = fbUser.uid;
      const userRef = doc(db, "users", uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        // existing user
        navigate(redirectTo, { replace: true });
      } else {
        // new user → go to signup details, but pass redirectTo forward
        navigate(`/signup-details?redirectTo=${redirectTo}`, { replace: true });
      }
    } catch (err) {
      console.error("Error verifying OTP", err);
      setError("Invalid OTP. Please try again.");
      setLoading(false);
    }
  };

  const handleBackToPhone = () => {
    setStep("phone");
    setOtp("");
    setError("");
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate("/home")}>
          ←
        </button>
        <div className={styles.headerTitleBlock}>
          <div className={styles.headerTitle}>{step === "phone" ? "Login / Signup" : "Verify OTP"}</div>
          <div className={styles.headerSubtitle}>True Meat – secure login with your mobile</div>
        </div>
      </header>

      <div className={styles.formWrapper}>
        {step === "phone" && (
          <form onSubmit={handleSendOtp} className={styles.form}>
            <label className={styles.field}>
              <span>Mobile number</span>
              <div className={styles.phoneRow}>
                <span className={styles.phonePrefix}>+91</span>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile" maxLength={10} />
              </div>
            </label>

            {error && <div className={styles.errorText}>{error}</div>}

            <button type="submit" className={styles.primaryBtn} disabled={loading}>
              {loading ? "Sending OTP..." : "Get OTP"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className={styles.form}>
            <p className={styles.infoText}>
              We’ve sent an OTP to <strong>+91 {phone}</strong>
            </p>

            <label className={styles.field}>
              <span>Enter OTP</span>
              <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6-digit OTP" maxLength={6} />
            </label>

            {error && <div className={styles.errorText}>{error}</div>}

            <div className={styles.otpActions}>
              <button type="button" className={styles.linkBtn} onClick={handleBackToPhone}>
                Change number
              </button>
            </div>

            <button type="submit" className={styles.primaryBtn} disabled={loading}>
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>
          </form>
        )}
      </div>

      {/* Invisible reCAPTCHA container */}
      <div id="recaptcha-container"></div>
    </div>
  );
}

export default LoginPage;
