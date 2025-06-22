export interface DpayState {
  isOpen: boolean;
  address: string | null;
  productName?: string;
  productDescription?: string;
  price?: number;
}

export interface DpayActions {
  open: () => void;
  close: () => void;
  toggle: () => void;
  connect: () => Promise<void>;
  disconnect: () => void;
  setProduct: (product: {
    productName: string;
    productDescription: string;
    price: number;
  }) => void;
  signTx: () => Promise<void>;
}

export interface DpayHook extends DpayState, DpayActions {}
