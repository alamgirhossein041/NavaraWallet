import { useState, useEffect } from "react";
import { localStorage } from "../utils/storage";
import { useIsFocused } from "@react-navigation/native";
import { useLocalStorage } from "./useLocalStorage";
import { LIST_WALLETS } from "../utils/storage";

export function useSelectedWallet() {
  const [listWallets] = useLocalStorage(LIST_WALLETS);
  const [mnemonic, setMnemonic] = useState<string>("");

  useEffect(() => {
    if (listWallets) {
      let active = listWallets && listWallets.find(wallet => wallet.isSelected)
      if (active) {
        let seedText = active.seedPhrase.join(" ")
        setMnemonic(seedText)
      }
    }
  }, [listWallets])

  return mnemonic
}
