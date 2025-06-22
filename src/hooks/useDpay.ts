import { useContext } from "react";
import { DPayContext } from "../context/DpayContext";

export const useDpay = () => {
  const context = useContext(DPayContext);
  if (context === undefined) {
    throw new Error("useDpay must be used within a DpayProvider");
  }
  return context;
};
