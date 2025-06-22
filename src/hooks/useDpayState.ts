import { requestAccess, signTransaction } from "@stellar/freighter-api";
import * as StellarSdk from "@stellar/stellar-sdk";
import { useCallback, useState } from "react";
import { DpayHook, DpayState } from "../types";
import {
  Address,
  Contract,
  nativeToScVal,
  TransactionBuilder,
} from "@stellar/stellar-sdk";

const BASE_URL = "https://api.dpay.local";

const HORIZON_URL = "https://horizon-testnet.stellar.org";
const DESTINATION = "GC544JQ6EMO5IXOF53NSDTU5T5AK6WZYFC65SOY5WYDQXK3A22GUFSUN";
const NATIVE_XLM_CONTRACT =
  "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQAUJKENLYUH";
const server = new StellarSdk.Horizon.Server(HORIZON_URL);

export async function triggerPayment(
  productId: string,
  buyerAddress: string,
  walletAddress: string,
  price: number,
  priceType: number
) {
  const payload = {
    productId: productId,
    buyerAddress,
    walletAddress,
    price,
    priceType,
  };
  const token = localStorage.getItem("token");
  return fetch(`${BASE_URL}/payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
}

export const useDpayState = (initialState: boolean = false): DpayHook => {
  const [state, setState] = useState<DpayState>({
    isOpen: initialState,
    address: null,
    productName: undefined,
    productDescription: undefined,
    price: undefined,
    dpayid: undefined,
  });

  const open = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: true }));
  }, []);

  const close = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const toggle = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: !prev.isOpen,
    }));
  }, []);

  const connect = useCallback(async () => {
    try {
      const { address } = await requestAccess();
      if (address) {
        setState((prev) => ({ ...prev, address }));
      }
    } catch (error) {
      console.error("Error connecting to Freighter:", error);
    }
  }, []);

  const signTx = useCallback(
    async (destination: string, onSuccess?: () => void) => {
      if (!state.address) {
        await connect();
      }

      const sourceAccount = await server.loadAccount(state.address!);

      let tx = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: ((await server.fetchBaseFee()) + 2000).toString(),
        networkPassphrase: StellarSdk.Networks.TESTNET,
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination,
            asset: StellarSdk.Asset.native(),
            amount: "100",
          })
        )
        .setTimeout(30)
        .build();

      const xdr = tx.toXDR();

      try {
        const signedTx = await signTransaction(xdr, {
          networkPassphrase: StellarSdk.Networks.TESTNET,
        });

        const signedFormattedTx = new StellarSdk.Transaction(
          signedTx.signedTxXdr,
          StellarSdk.Networks.TESTNET
        );
        console.log("Transaction signed:", signedTx);
        console.log("signedFormattedTx signed:", signedFormattedTx);

        const broadcastTx = await server.submitTransaction(signedFormattedTx);
        if (broadcastTx.successful) {
          // Trigger payment API call
          if (state.dpayid && state.address && state.price !== undefined) {
            // Use state.address for both buyer and wallet for now, and default priceType to "XLM"
            triggerPayment(
              state.dpayid,
              state.address,
              state.address,
              state.price,
              3
            );
          }
          if (onSuccess) onSuccess();
        }
      } catch (error) {
        console.error("Error signing transaction:", error);
      }
    },
    [state.address, connect]
  );

  const disconnect = useCallback(() => {
    setState((prev) => ({ ...prev, address: null }));
  }, []);

  const setProduct = useCallback(
    (product: {
      productName: string;
      productDescription: string;
      price: number;
      dpayid: string;
    }) => {
      setState((prev) => ({
        ...prev,
        ...product,
      }));
    },
    []
  );

  return {
    ...state,
    open,
    close,
    toggle,
    connect,
    disconnect,
    setProduct,
    signTx,
  };
};

/**
 * 
 * 
  const amount = 50;
    const userPublicKey = state.address!;
    const sourceAccount = await server.loadAccount(state.address!);

    const args = [
      new Address(userPublicKey).toScVal(), // from: Address
      new Address(NATIVE_XLM_CONTRACT).toScVal(), // token: Address
      nativeToScVal(BigInt(amount), { type: "i128" }), // amount: i128
    ];

    const operation = contract.call("deposit", ...args);

    const transaction = new TransactionBuilder(sourceAccount, {
      fee: "100000", // Set appropriate fee
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(operation)
      .setTimeout(30)
      .build();
    console.log(state.address);

    const xdr = transaction.toXDR();

    const signedTx = await signTransaction(xdr, {
      networkPassphrase: StellarSdk.Networks.TESTNET,
    });

    const signedFormattedTx = new StellarSdk.Transaction(
      signedTx.signedTxXdr,
      StellarSdk.Networks.TESTNET
    );
    console.log("Transaction signed:", signedTx);
    console.log("signedFormattedTx signed:", signedFormattedTx);

    const broadcastTx = await server.submitTransaction(signedFormattedTx);
    console.log("broadcastTx signed:", broadcastTx);

    
 */
