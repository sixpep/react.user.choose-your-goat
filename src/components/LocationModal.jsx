import React, { useState, useContext } from "react";
import { Context } from "../App";

function LocationModal({ onConfirm, error, isConfirmed, onContinue, pincode }) {
  const [inputValue, setInputValue] = useState("");

  const { deliveryLocation } = useContext(Context);

  console.log(deliveryLocation, isConfirmed);

  if (isConfirmed) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.45)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
        }}
      >
        <div
          style={{
            background: "#ffffff",
            borderRadius: 16,
            padding: "24px 20px 18px",
            width: "90%",
            maxWidth: 420,
            boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              margin: "0 auto 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #22c55e 0%, #16a34a 45%, #15803d 100%)",
              color: "#ffffff",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            ✓
          </div>

          <h2
            style={{
              margin: "4px 0 6px",
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            Congratulations! 🎉
          </h2>

          <p
            style={{
              margin: "0 0 14px",
              fontSize: 14,
              color: "#4b5563",
              lineHeight: 1.5,
            }}
          >
            Wow, we are serving to your location
            {pincode ? ` (${pincode})` : ""}. You can now browse and place your order.
          </p>

          <button
            type="button"
            onClick={onContinue}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 999,
              background: "#111827",
              border: "none",
              color: "#ffffff",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onConfirm(inputValue.trim());
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: 16,
          padding: "22px 20px 18px",
          width: "90%",
          maxWidth: 420,
          boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
          position: "relative",
        }}
      >
        {/* Close button (only if user already has a pincode) */}
        {deliveryLocation && !isConfirmed && (
          <button
            onClick={onContinue}
            style={{
              position: "absolute",
              top: 10,
              right: 12,
              border: "none",
              background: "transparent",
              fontSize: 20,
              cursor: "pointer",
              color: "#6b7280",
            }}
          >
            ✕
          </button>
        )}
        <h2
          style={{
            margin: "4px 0 4px",
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          Where should we deliver?
        </h2>

        <p
          style={{
            margin: "0 0 14px",
            fontSize: 13,
            color: "#6b7280",
            lineHeight: 1.5,
          }}
        >
          Enter your delivery pincode to check if we serve your location.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Enter your pincode"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            style={{
              width: "100%",
              padding: "9px 11px",
              borderRadius: 999,
              border: "1px solid #d1d5db",
              fontSize: 14,
              marginBottom: 10,
              outline: "none",
            }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 999,
              background: "#111827",
              border: "none",
              color: "#ffffff",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Confirm pincode
          </button>
        </form>

        {error && (
          <p
            style={{
              color: "#b91c1c",
              fontSize: 12,
              marginTop: 8,
            }}
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default LocationModal;
