import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../../App";
import { pincodes, cityMap } from "../../../staticValues";
import { db } from "../../../firebase/setup";
import { collection, doc, updateDoc, getDoc, getDocs, onSnapshot, query, orderBy, limit, where } from "firebase/firestore";

const SelectAddress = ({ selectedAddressId, setSelectedAddressId, setCreateNewAddress, placeOrder }) => {
  const { order, setOrder } = useContext(Context);
  const [tokenExists, setTokenExists] = useState(true);
  const [showLocationFields, setShowLocationFields] = useState(false);
  // const [locationLoading, setLocationLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState([]);
  const [minDate, setMinDate] = useState("");

  const indianMobileNumberRegex = /^[6-9]\d{9}$/;

  const handleUpdateLocation = async (addressId, index) => {
    setLocationLoading((prev) => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const updatedGeo = {
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6),
        };

        try {
          // Update in Firestore
          await updateDoc(doc(db, "addresses", addressId), {
            geolocation: updatedGeo,
          });

          // Update in local order.userAddressesList
          setOrder((prev) => ({
            ...prev,
            userAddressesList: prev.userAddressesList.map((addr) => (addr.id === addressId ? { ...addr, geolocation: updatedGeo } : addr)),
          }));
        } catch (error) {
          console.error("Error updating location:", error);
          alert("Failed to update location");
        } finally {
          // setLocationLoading(false);
          setLocationLoading((prev) => {
            const updated = [...prev];
            updated[index] = false;
            return updated;
          });
        }
      },
      (error) => {
        console.error("Error fetching location:", error);
        alert("Failed to fetch location. Please enable location services.");
        // setLocationLoading(false);
        setLocationLoading((prev) => {
          const updated = [...prev];
          updated[index] = false;
          return updated;
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };

  const accessToken = localStorage.getItem("choose-your-goat-token");

  useEffect(() => {
    if (order.userAddressesList) {
      setLocationLoading(Array(order.userAddressesList.length).fill(false));
    }
  }, [order.userAddressesList]);

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
  const placeOrderIsEnabled =
    selectedAddressId.length > 0 && ((order.orderType !== "chicken" && order.orderType !== "egg") || !!order.scheduledDeliveryDate);

  return (
    <section className="mb-4 bg-white py-4 pb-20 antialiased dark:bg-gray-900 md:pb-16 shadow-inner max-h-[99vh] overflow-y-auto z-30">
      {(order.orderType === "chicken" || order.orderType === "egg") && (
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
              {!order.scheduledDeliveryDate && <span className="text-sm text-red-500 ps-1">Enter a valid delivery date</span>}
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Customize</h2>
        <textarea
          name="butcherInstructions"
          id="butcherInstructions"
          maxLength={350}
          rows={3} // ✅ 3 lines height
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
          placeholder="Eg: Medium pieces, extra cleaning, separate liver…"
          value={order.butcherInstructions || ""}
          onChange={handleChangeInput}
        />
        <div className="mt-1 text-right text-xs text-gray-500">{order.butcherInstructions?.length || 0}/350</div>
      </div>

      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Select Address</h2>
        {(order.orderType === "chicken" || order.orderType === "egg") && <span>*Delivery will take about 45 min.</span>}
        {/* Place order button */}
        {order.userAddressesList?.length >= 3 && (
          <div
            role="button"
            aria-disabled={!placeOrderIsEnabled}
            tabIndex={0}
            onClick={() => {
              if (placeOrderIsEnabled) {
                placeOrder(true);
              }
            }}
            className={`border border-dashed border-gray-400 rounded-lg p-4 text-center 
    ${placeOrderIsEnabled ? "cursor-pointer hover:bg-gray-50 bg-[#1D1E22] text-white" : "cursor-not-allowed bg-gray-300 text-gray-500"}`}
          >
            <p className="font-large">Place Order</p>
          </div>
        )}
        {/* Add New Address Card */}
        <div
          onClick={() => {
            setSelectedAddressId("");
            setOrder((prev) => {
              const { selectedAddressId, ...rest } = prev; // remove the key immutably
              return { ...rest };
            });
            setCreateNewAddress(true);
          }}
          className="border border-dashed border-gray-400 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
        >
          <p className="text-blue-600 font-medium">+ Add New Address</p>
        </div>
        {order.userAddressesList?.map((address, index) => (
          <label
            key={address.id}
            className={`block border rounded-lg p-4 cursor-pointer ${
              selectedAddressId === address.id ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name="selectedAddress"
                value={address.id}
                checked={selectedAddressId === address.id}
                onChange={() => {
                  setSelectedAddressId(address.id);
                  setOrder((prev) => (prev?.selectedAddressId == address.id ? prev : { ...prev, selectedAddressId: address.id }));
                }}
                className="mt-1"
              />
              <div>
                <p className="font-semibold text-gray-800">{address.userName}</p>
                <p className="text-sm text-gray-600">{address.userAddress}</p>
                <p className="text-sm text-gray-600">{address.landmark}</p>
                <p className="text-sm text-gray-600">{address.city}</p>
                <p className="text-sm text-gray-600">{address.userPinCode}</p>
                <p className="text-sm text-gray-600">{address.userPhoneNumber}</p>
                <p className="text-sm text-gray-600">
                  {"Latitude: " + (address.geolocation?.latitude || "NA") + ", Longitude: " + (address.geolocation?.longitude || "NA")}
                </p>
                <button
                  type="button"
                  onClick={() => handleUpdateLocation(address.id, index)}
                  className="mt-2 text-sm text-blue-600 hover:underline"
                  disabled={locationLoading[index]}
                >
                  {locationLoading[index] ? "Updating..." : "Update Location"}
                </button>
              </div>
            </div>
          </label>
        ))}

        {/* Place order button */}
        <div
          role="button"
          aria-disabled={!placeOrderIsEnabled}
          tabIndex={0}
          onClick={() => {
            if (placeOrderIsEnabled) {
              placeOrder(true);
            }
          }}
          className={`border border-dashed border-gray-400 rounded-lg p-4 text-center 
    ${placeOrderIsEnabled ? "cursor-pointer hover:bg-gray-50 bg-[#1D1E22] text-white" : "cursor-not-allowed bg-gray-300 text-gray-500"}`}
        >
          <p className="font-large">Place Order</p>
        </div>
      </div>
    </section>
  );
};

export default SelectAddress;
