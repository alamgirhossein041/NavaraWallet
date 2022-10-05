import React from "react";
import { useRecoilState } from "recoil";
import SelectOption, { IOption } from "../../components/SelectOption";
import { walletSelectedState } from "../../data/globalState/userData";
import WalletIcon from "../../assets/icons/icon-near.svg";
const options: IOption[] = [
  { label: "Near", value: "Near" },
  { label: "Bitcoin", value: "Bitcoin" },
];

const SelectNetwork = () => {
  const [walletSelected, setWalletSelected] =
    useRecoilState(walletSelectedState);
  return (
    <SelectOption
      icon={<WalletIcon width="100%" fill="white" />}
      value={walletSelected}
      options={options}
      onSetValue={(value: any) => {
        setWalletSelected(value);
      }}
    />
  );
};

export default SelectNetwork;
