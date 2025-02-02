import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../firebase/setup";
import styles from "../Meat Catalog/Cart/Cart.module.css";
import { useNavigate } from "react-router-dom";
import { LuMoveLeft } from "react-icons/lu";

const LoginPage = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileNumberError, setMobileNumberError] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [confirmation, setConfirmation] = useState();
  const [showOtpBuffer, setShowOtpBuffer] = useState(false);

  const navigate = useNavigate();

  const indianMobileNumberRegex = /^[6-9]\d{9}$/;

  const sendOtp = async () => {
    if (!indianMobileNumberRegex.test(mobileNumber)) {
      setMobileNumberError("Enter a valid mobile number");
      return;
    }

    setMobileNumberError("");
    setShowOtpBuffer(true);

    try {
      const recaptcha = new RecaptchaVerifier(auth, "recaptcha", {
        size: "invisible",
      });

      const confirm = await signInWithPhoneNumber(
        auth,
        "+91 " + mobileNumber,
        recaptcha
      );

      console.log("confirm", confirm);

      setConfirmation(confirm);
      setShowOtpBuffer(false);
    } catch (error) {
      setShowOtpBuffer(false);
      console.log("error in sending otp!", error);
    }
  };

  const verifyOtp = async () => {
    setShowOtpBuffer(true);
    try {
      const otpVerification = await confirmation.confirm(otp);
      console.log("otpVerification", otpVerification);
      localStorage.setItem(
        "choose-your-goat-token",
        otpVerification.user.accessToken
      );
      localStorage.setItem("choose-your-goat-userId", otpVerification.user.uid);
      setShowOtpBuffer(false);
      setOtpError("");
      window.location.href = "/";
    } catch (error) {
      setShowOtpBuffer(false);
      setOtpError("Enter a valid OTP");
      console.log("error in verifying otp", error);
    }
  };

  return (
    <div>
      <div className={styles.backBar}>
        <div className={styles.backBtn} onClick={() => navigate("/")}>
          <i>
            <LuMoveLeft size={20} />
          </i>
          <p>Back</p>
        </div>
      </div>
      <section className="bg-gray-50 dark:bg-gray-900 overflow-hidden">
        <div id="recaptcha"></div>
        <div className="mt-4 min-h-screen flex flex-col items-center px-4 py-12 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              <div className="space-y-4 md:space-y-6" action="#">
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your Mobile Number
                  </label>
                  <input
                    type="number"
                    name="mobileNumber"
                    id="mobileNumber"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="999-999-9999"
                    required=""
                    onChange={(e) => setMobileNumber(e.target.value)}
                  />
                  {mobileNumberError && (
                    <span className="text-sm text-red-500 ps-1">
                      {mobileNumberError}
                    </span>
                  )}
                </div>
                {confirmation && (
                  <div>
                    <label
                      htmlFor="number"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      OTP
                    </label>
                    <input
                      type="number"
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required=""
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    {otpError && (
                      <span className="text-sm text-red-500 ps-1">
                        {otpError}
                      </span>
                    )}
                  </div>
                )}
                {/* <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                        required=""
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        for="remember"
                        className="text-gray-500 dark:text-gray-300"
                      >
                        Remember me
                      </label>
                    </div>
                  </div>
                  <a
                    href="#"
                    className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Forgot password?
                  </a>
                </div> */}
                <span className="text-xs text-center text-neutral-500 leading-3">
                  We will send you a <strong>One Time Password</strong> on your
                  phone number
                </span>
                <button
                  onClick={confirmation ? verifyOtp : sendOtp}
                  style={{ backgroundColor: "#1d1e22", color: "white" }}
                  className="w-full text-white flex justify-center bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  {showOtpBuffer ? (
                    <div className={styles.loginLoader}></div>
                  ) : confirmation ? (
                    "Verify OTP"
                  ) : (
                    "Send OTP"
                  )}
                </button>
                {/* <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Don’t have an account yet?{" "}
                    <a
                      href="#"
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                    >
                      Sign up
                    </a>
                  </p> */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
