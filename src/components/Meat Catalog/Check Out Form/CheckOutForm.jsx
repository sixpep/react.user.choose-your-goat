import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../../App";
import { pincodes, cityMap } from "../../../staticValues";

const CheckOutForm = ({ sendOtp, placeOrder }) => {
  const { order, setOrder } = useContext(Context);
  const [checkFormInputs, setCheckformInputs] = useState(false);
  const [tokenExists, setTokenExists] = useState(true);
  const [minDate, setMinDate] = useState("");

  const indianMobileNumberRegex = /^[6-9]\d{9}$/;
  const handleFormValidations = () => {
    setCheckformInputs(true);
    if (
      order.userName === "" ||
      !indianMobileNumberRegex.test(order.userPhoneNumber) ||
      order.userAddress === "" ||
      order.landmark === "" ||
      order.userPinCode === "" ||
      !order.userPinCode ||
      (order.orderType === "chicken" && !order.scheduledDeliveryDate)
    ) {
      return;
    } else if (localStorage.getItem("choose-your-goat-token")) {
      placeOrder();
    } else {
      sendOtp();
    }
  };

  const handleChangeInput = (e) => {
    const { id, value } = e.target;
    setOrder((prev) => ({
      ...prev,
      [id]: value,
    }));
    console.log(order);
  };

  const updateMinDate = () => {
    const now = new Date();
    const currentHour = now.getHours();

    let today = now.toISOString().split("T")[0];
    now.setDate(now.getDate() + 1);
    let tomorrow = now.toISOString().split("T")[0];

    setMinDate(currentHour < 20 ? today : tomorrow);
  };

  const accessToken = localStorage.getItem("choose-your-goat-token");

  useEffect(() => {
    updateMinDate();
    const interval = setInterval(updateMinDate, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!accessToken) {
      setTokenExists(false);
    }
  }, [accessToken]);

  return (
    <section className="mb-4 bg-white py-4 pb-20 antialiased dark:bg-gray-900 md:pb-16 shadow-inner max-h-[99vh] overflow-y-auto z-30">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        {/* <div className="flex justify-end">
          <button onClick={() => setShowCheckOutForm(false)}>
            <RxCross2 size={24} />
          </button>
        </div> */}

        <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12 xl:gap-16">
          <div className="min-w-0 flex-1 space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Delivery Details</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
                <div>
                  <label htmlFor="your_name" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Your name*
                  </label>
                  <input
                    type="text"
                    id="userName"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                    placeholder="Bonnie Green"
                    onChange={handleChangeInput}
                    readOnly={tokenExists}
                    value={order.userName}
                  />
                  {checkFormInputs && order.userName.length < 1 && <span className="text-sm text-red-500 ps-1">Enter a valid name</span>}
                </div>

                <div>
                  <label htmlFor="phone-input-3" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    {" "}
                    Phone Number*{" "}
                  </label>
                  <div className="flex items-center">
                    <div className="relative w-full">
                      <input
                        type="number"
                        id="userPhoneNumber"
                        className="z-20 block w-full rounded-lg border  border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:border-s-gray-700  dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500"
                        pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                        placeholder="123-456-7890"
                        onChange={handleChangeInput}
                        readOnly={tokenExists}
                        value={order.userPhoneNumber}
                      />
                      {checkFormInputs && !indianMobileNumberRegex.test(order.userPhoneNumber) && (
                        <span className="text-sm text-red-500 ps-1">Enter a valid phone number</span>
                      )}
                    </div>
                  </div>
                </div>

                {order.orderType === "chicken" && (
                  <div>
                    <label htmlFor="phone-input-3" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                      {" "}
                      Delivery Date*{" "}
                    </label>
                    <div className="flex items-center">
                      <div className="relative w-full">
                        <input
                          type="date"
                          min={minDate}
                          id="scheduledDeliveryDate"
                          className="z-20 block w-full rounded-lg border  border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:border-s-gray-700  dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500"
                          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                          placeholder="123-456-7890"
                          onChange={handleChangeInput}
                          value={order.scheduledDeliveryDate}
                        />
                        {checkFormInputs && !order.scheduledDeliveryDate && (
                          <span className="text-sm text-red-500 ps-1">Enter a valid delivery date</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="userAddress" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    {" "}
                    Pin Code*{" "}
                  </label>
                  <select
                    id="userPinCode"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                    value={order.userPinCode}
                    onChange={(e) =>
                      setOrder((prev) => ({
                        ...prev,
                        userPinCode: e.target.value,
                        userCity: cityMap[e.target.value],
                      }))
                    }
                  >
                    <option key={0} value="">
                      Select Pincode
                    </option>
                    {pincodes.map((pinCode, index) => (
                      <option key={index + 1} value={pinCode}>
                        {pinCode}
                      </option>
                    ))}
                  </select>
                  {checkFormInputs && !pincodes.includes(parseInt(order.userPinCode)) && (
                    <span className="text-sm text-red-500 ps-1">Select a valid pincode</span>
                  )}
                </div>

                <div>
                  <label htmlFor="userAddress" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    {" "}
                    Street Address*{" "}
                  </label>
                  <input
                    type="text"
                    id="userAddress"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                    placeholder="Flowbite LLC"
                    onChange={handleChangeInput}
                    value={order.userAddress}
                  />
                  {checkFormInputs && order.userAddress.length < 1 && <span className="text-sm text-red-500 ps-1">Enter a valid address</span>}
                </div>

                <div>
                  <label htmlFor="landmark" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    {" "}
                    Landmark*{" "}
                  </label>
                  <input
                    type="text"
                    id="landmark"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                    placeholder="Flowbite LLC"
                    onChange={handleChangeInput}
                    value={order.landmark}
                  />
                  {checkFormInputs && order?.landmark.length < 1 && <span className="text-sm text-red-500 ps-1">Enter a valid landmark</span>}
                </div>

                <div>
                  <label htmlFor="city" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    {" "}
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                    placeholder="Flowbite LLC"
                    readOnly
                    // value={"Sangareddy"}
                    value={order.userCity}
                  />
                  {checkFormInputs && (!order?.userCity?.length || order?.userCity?.length < 1) && (
                    <span className="text-sm text-red-500 ps-1">Enter a valid City</span>
                  )}
                </div>

                <div className="bg-white p-4 shadow-top fixed flex justify-center bottom-0 left-0 w-full space-y-3">
                  <button
                    style={{
                      backgroundColor: "#1d1e22",
                      color: "white",
                    }}
                    onClick={handleFormValidations}
                    className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-3 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4  focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckOutForm;

// {
//   /* <div>
//                   <div className="mb-2 flex items-center gap-2">
//                     <label
//                       htmlFor="select-city-input-3"
//                       className="block text-sm font-medium text-gray-900 dark:text-white"
//                     >
//                       {" "}
//                       City*{" "}
//                     </label>
//                   </div>
//                   <select
//                     id="select-city-input-3"
//                     className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
//                   >
//                     <option selected>San Francisco</option>
//                     <option value="NY">New York</option>
//                     <option value="LA">Los Angeles</option>
//                     <option value="CH">Chicago</option>
//                     <option value="HU">Houston</option>
//                   </select>
//                 </div>
//                 <div>
//                   <div className="mb-2 flex items-center gap-2">
//                     <label
//                       htmlFor="select-country-input-3"
//                       className="block text-sm font-medium text-gray-900 dark:text-white"
//                     >
//                       {" "}
//                       Country*{" "}
//                     </label>
//                   </div>
//                   <select
//                     id="select-country-input-3"
//                     className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
//                   >
//                     <option selected>India</option>
//                   </select>
//                 </div>
//                 <div className="flex gap-4 items-center z-20  w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 justify-between">
//                   <label
//                     htmlFor="currentLocation"
//                     className="block text-sm font-medium text-gray-900 dark:text-white"
//                   >
//                     Is my current location :
//                   </label>
//                   <input type="checkbox" />
//                 </div> */
// }

// {
//   /* <div className={styles.quantityControl}>
//             <p>
//               Extras: ₹ 200 <br />{" "}
//             </p>
//             <div className={styles.quantityLabels}>
//               <div className={styles.quantityButtons}>
//                 <button>-</button>
//                 <input type="text" readOnly value={1} />
//                 <button>+</button>
//               </div>
//               <span>₹ 20/-</span>
//             </div>
//             <span className={styles.availableNote}>(Available : 1 sets)</span>
//           </div> */
// }

// {
//   /* <div className="mt-6 w-full space-y-6 sm:mt-8 lg:mt-0 lg:max-w-xs xl:max-w-md">
//             <div className="flow-root">
//               <div className="-my-3 divide-y divide-gray-200 dark:divide-gray-800">
//                 <dl className="flex items-center justify-between gap-4 py-3">
//                   <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
//                     Subtotal
//                   </dt>
//                   <dd className="text-base font-medium text-gray-900 dark:text-white">
//                     $8,094.00
//                   </dd>
//                 </dl>

//                 <dl className="flex items-center justify-between gap-4 py-3">
//                   <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
//                     Store Pickup
//                   </dt>
//                   <dd className="text-base font-medium text-gray-900 dark:text-white">
//                     $99
//                   </dd>
//                 </dl>

//                 <dl className="flex items-center justify-between gap-4 py-3">
//                   <dt className="text-base font-bold text-gray-900 dark:text-white">
//                     Total
//                   </dt>
//                   <dd className="text-base font-bold text-gray-900 dark:text-white">
//                     $8,392.00
//                   </dd>
//                 </dl>
//               </div>
//             </div>

//             <div className="space-y-3">
//               <button
//                 onClick={() => console.log("enaljb")}
//                 disabled
//                 type="submit"
//                 className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4  focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
//               >
//                 Place Order
//               </button>
//             </div>
//           </div> */
// }
