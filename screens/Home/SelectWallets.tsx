import SelectOption from "../../components/SelectOption";
import WalletIcon from "../../assets/icons/icon-solid-wallet.svg";
import { LIST_WALLETS } from "../../utils/storage";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import React from "react"
import { useRecoilState } from "recoil";
import { listWalletsState } from "../../data/globalState/listWallets";
import { cloneDeep } from "lodash";
import { CreditCardIcon } from "react-native-heroicons/solid";
const SelectWallets = () => {
  // const [listWallets, setListWallets] = useLocalStorage(LIST_WALLETS)
  const [listWallets, setListWallets] = useRecoilState(listWalletsState)
  const handleChangeWallet = (value: any) => {
    const indexSelected = listWallets?.findIndex(wallet => wallet.value === value)
    const newSelect = cloneDeep(listWallets)?.map((wallet, index) => {
      if (index === indexSelected) {
        wallet.isSelected = true
      } else {
        wallet.isSelected = false
      }
      return wallet
    })
    setListWallets(newSelect)
  }
  return (
    <SelectOption
      icon={<CreditCardIcon fill="white" />}
      value={listWallets && listWallets?.filter((item) => item.isSelected)[0].value}
      options={listWallets || []}
      onSetValue={(newSelect) => {
        handleChangeWallet(newSelect)
      }}
    />
  )
};

export default SelectWallets;
