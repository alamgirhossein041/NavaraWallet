import React from "react";
import { useRecoilState } from "recoil";
import AllNetwork from "../../assets/icons/icon-all-networks.svg";
import SelectOption, { IOption } from "../../components/SelectOption";
import networks from "./NetworkData";
import {
  enabledNetworkState,
  selectedNetworkState,
} from "../../data/globalState/networkData";
import { useRecoilValue } from "recoil";
type SelectNetworkProps = {
  onSetValue?: (value: any) => void;
};

const SelectNetwork = ({ onSetValue = () => {} }: SelectNetworkProps) => {
  const storedEnabledNetwork = useRecoilValue(enabledNetworkState);
  let networkList = networks.filter(
    (network) => storedEnabledNetwork.indexOf(network.id) !== -1
  );

  networkList = [
    {
      id: "all",
      icon: <AllNetwork width="100%" height="100%" />,
      name: "All Networks",
    },
    ...networkList,
  ];

  const options: IOption[] = networkList.map((network) => {
    return {
      label: network.name,
      value: network.id,
    };
  });
  const [storedSelectedNetwork, setStoredSelectedNetwork] =
    useRecoilState(selectedNetworkState);
  const index = options.findIndex(
    (option) => option.value === storedSelectedNetwork
  );
  return (
    <SelectOption
      icon={networkList[index].icon}
      iconSize="w-5 h-5"
      stringStyle="text-xs"
      value={networkList[index].name}
      options={options}
      onSetValue={(value: any) => {
        setStoredSelectedNetwork(value);
        onSetValue(value);
      }}
    />
  );
};

export default SelectNetwork;
