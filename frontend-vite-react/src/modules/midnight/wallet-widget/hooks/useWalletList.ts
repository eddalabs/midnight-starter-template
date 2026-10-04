import { useEffect, useState } from "react";
import { AvailableWallet, MidnightBrowserWallet } from "../api/walletController";

export const useWalletList = () => {
  const [wallets, setWallets] = useState<AvailableWallet[]>([]);
  useEffect(() => {
    async function get() {
      setWallets(MidnightBrowserWallet.getAvailableWallets());
    }
    get();
  }, []);

  return wallets;
};