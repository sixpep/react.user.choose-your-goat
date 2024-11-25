import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase/setup";
import styles from "../Meat Catalog/Cart/Cart.module.css";

const LoginPage = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileNumberError, setMobileNumberError] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState();

  const indianMobileNumberRegex = /^[6-9]\d{9}$/;

  const sendOtp = async () => {
    if (!indianMobileNumberRegex.test(mobileNumber)) {
      setMobileNumberError("Enter a valid mobile number");
      return;
    }

    const recaptcha = new RecaptchaVerifier(auth, "recaptcha", {
      size: "invisible",
    });

    const confirm = await signInWithPhoneNumber(
      auth,
      "+91 " + mobileNumber,
      recaptcha
    );

    try {
    } catch (error) {
      console.log("error in sending otp!", error);
    }
  };

  const verifyOtp = async () => {
    try {
      const otpVerification = await confirmation.confirm(otp);
    } catch (error) {}
  };

  return (
    <section class="bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div class="min-h-screen flex flex-col items-center justify-center px-4 py-12 mx-auto md:h-screen lg:py-0">
        {/* <a
          href="#"
          class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img
            class="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          Flowbite
        </a> */}
        <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <div class="space-y-4 md:space-y-6" action="#">
              <div>
                <label
                  for="email"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your Mobile Number
                </label>
                <input
                  type="number"
                  name="mobileNumber"
                  id="mobileNumber"
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="999-999-9999"
                  required=""
                />
                <span>{mobileNumberError}</span>
              </div>
              <div>
                <label
                  for="number"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  OTP
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required=""
                />
              </div>
              {/* <div class="flex items-center justify-between">
                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      required=""
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label
                      for="remember"
                      class="text-gray-500 dark:text-gray-300"
                    >
                      Remember me
                    </label>
                  </div>
                </div>
                <a
                  href="#"
                  class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Forgot password?
                </a>
              </div> */}
              <button
                type="submit"
                class="w-full text-white  bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Send OTP
              </button>
              {/* <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet?{" "}
                  <a
                    href="#"
                    class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Sign up
                  </a>
                </p> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
