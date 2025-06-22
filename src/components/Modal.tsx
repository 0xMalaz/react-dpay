import React, { useEffect, useState } from "react";
import { useDpay } from "../hooks/useDpay";
import { QRCode } from "react-qrcode-logo";
import { motion, AnimatePresence } from "framer-motion";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  overlayClassName?: string;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

export const DPayModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  className = "",
  overlayClassName = "",
  closeOnOverlayClick = true,
  closeOnEscape = true,
}) => {
  const { productName, productDescription, price, connect, signTx } = useDpay();
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);

  const handleClose = () => {
    onClose();
    setIsPaymentSuccessful(false);
  };

  const handleTestPayment = () => {
    setIsPaymentSuccessful(true);
  };

  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`${overlayClassName}`}
      onClick={closeOnOverlayClick ? handleClose : undefined}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "16px",
      }}
    >
      <div
        className={`${className}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          maxWidth: "28rem",
          width: "100%",
          maxHeight: "90vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AnimatePresence>
          {!isPaymentSuccessful ? (
            <motion.div
              key="payment-content"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "24px",
                  borderBottom: "1px solid #f3f4f6",
                }}
              >
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    color: "#111827",
                    margin: 0,
                  }}
                >
                  Complete Payment
                </h2>
                <button
                  onClick={handleClose}
                  style={{
                    padding: "8px",
                    backgroundColor: "transparent",
                    border: "none",
                    borderRadius: "50%",
                    cursor: "pointer",
                    color: "#6b7280",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f3f4f6")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div style={{ padding: "24px", overflowY: "auto" }}>
                {/* Product Info */}
                <div style={{ marginBottom: "24px" }}>
                  <div style={{ marginBottom: "12px" }}>
                    <h3
                      style={{
                        fontWeight: "500",
                        color: "#111827",
                        marginBottom: "4px",
                        fontSize: "16px",
                      }}
                    >
                      {productName}
                    </h3>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#6b7280",
                        lineHeight: "1.5",
                        margin: 0,
                      }}
                    >
                      {productDescription}
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 16px",
                      backgroundColor: "#f9fafb",
                      borderRadius: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#374151",
                      }}
                    >
                      Total
                    </span>
                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "#111827",
                      }}
                    >
                      ${price}
                    </span>
                  </div>
                </div>

                {/* QR Code Section */}
                <div
                  style={{
                    textAlign: "center",
                    marginBottom: "24px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <QRCode
                      value="web+stellar:tx?xdr=AAAAAgAAAAA6HRnZSBhCZefKXu1l5F2167rYlmSBgrZARfgrERXm%2FgAAASwAALrwAAAACAAAAAEAAAAAAAAAAAAAAABoVtdPAAAAAAAAAAEAAAAAAAAAAQAAAAC7ziYeIx3UXcXu2yHOnZ9Ar1s4KL3ZOx22BwurYNaNQgAAAAAAAAAAAJiWgAAAAAAAAAAA&network=test"
                      size={192}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      fontSize: "14px",
                      color: "#6b7280",
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect
                        x="5"
                        y="2"
                        width="14"
                        height="20"
                        rx="2"
                        ry="2"
                      ></rect>
                      <line x1="12" y1="18" x2="12.01" y2="18"></line>
                    </svg>
                    <span>Scan with your mobile wallet</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <button
                    onClick={signTx}
                    style={{
                      width: "100%",
                      backgroundColor: "#2563eb",
                      color: "white",
                      fontWeight: "500",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "none",
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                      fontSize: "14px",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#1d4ed8")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#2563eb")
                    }
                  >
                    Proceed with Payment
                  </button>
                  <button
                    onClick={handleTestPayment}
                    style={{
                      width: "100%",
                      backgroundColor: "#10b981",
                      color: "white",
                      fontWeight: "500",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "none",
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                      fontSize: "14px",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#059669")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#10b981")
                    }
                  >
                    Test Payment Animation
                  </button>

                  <button
                    onClick={handleClose}
                    style={{
                      width: "100%",
                      backgroundColor: "#f3f4f6",
                      color: "#374151",
                      fontWeight: "500",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "none",
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                      fontSize: "14px",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#e5e7eb")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f3f4f6")
                    }
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div
                style={{
                  padding: "16px 24px",
                  backgroundColor: "#f9fafb",
                  borderTop: "1px solid #f3f4f6",
                  marginTop: "auto",
                }}
              >
                <p
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    textAlign: "center",
                    margin: 0,
                  }}
                >
                  Secure payment powered by Stellar Network
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success-message"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, type: "spring" }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "48px",
                flexGrow: 1,
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.2,
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
              >
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <motion.circle
                    cx="12"
                    cy="12"
                    r="11"
                    stroke="#4ade80"
                    strokeWidth="2"
                    initial={{ strokeDasharray: "0 1", pathLength: 0 }}
                    animate={{
                      strokeDasharray: "1 1",
                      pathLength: 1,
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                  <motion.path
                    d="M7 13l3 3 7-7"
                    stroke="#4ade80"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{
                      delay: 0.4,
                      duration: 0.3,
                      ease: "easeInOut",
                    }}
                  />
                </svg>
              </motion.div>
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  color: "#111827",
                  marginTop: "24px",
                  marginBottom: "8px",
                }}
              >
                Payment Successful!
              </h2>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
