import React, { createContext, ReactNode } from "react";
import { DPayModal } from "../components/Modal";
import { useDpayState } from "../hooks/useDpayState";
import { DpayHook } from "../types";

export const DPayContext = createContext<DpayHook | undefined>(undefined);

interface DpayProviderProps {
  children: ReactNode;
  initialState?: boolean;
}

export const DpayProvider: React.FC<DpayProviderProps> = ({
  children,
  initialState = false,
}) => {
  const dpayHook = useDpayState(initialState);

  return (
    <DPayContext.Provider value={dpayHook}>
      {children}
      <DPayModal isOpen={dpayHook.isOpen} onClose={dpayHook.close} />
    </DPayContext.Provider>
  );
};
