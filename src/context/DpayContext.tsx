import React, { createContext, ReactNode, useEffect } from "react";
import { DPayModal } from "../components/Modal";
import { useDpayState } from "../hooks/useDpayState";
import { DpayHook } from "../types";

const BASE_URL = "https://api.dpay.local";

export const DPayContext = createContext<DpayHook | undefined>(undefined);

const postAuthToken = async (apiKey: string): Promise<string> => {
  console.log("hehe");
  const encodedKey = encodeURIComponent(apiKey);
  const response = await fetch(`${BASE_URL}/auth/token?apiKey=${encodedKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });

  if (response.ok) {
    return response.text();
  } else {
    throw new Error("Failed to fetch token");
  }
};

interface DpayProviderProps {
  children: ReactNode;
  initialState?: boolean;
  apiKey: string;
}

export const DpayProvider: React.FC<DpayProviderProps> = ({
  children,
  initialState = false,
  apiKey,
}) => {
  const [token, setToken] = React.useState<string>("");
  const dpayHook = useDpayState(initialState);

  const tokenReceived = async () => {
    const token = await postAuthToken(apiKey);

    localStorage.setItem("token", token);
    setToken(token);
  };

  useEffect(() => {
    if (apiKey) {
      tokenReceived();
    }
  }, [apiKey]);

  return (
    <DPayContext.Provider value={dpayHook}>
      {children}
      <DPayModal isOpen={dpayHook.isOpen} onClose={dpayHook.close} />
    </DPayContext.Provider>
  );
};
