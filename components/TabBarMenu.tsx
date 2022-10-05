import React from "react";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { PlusIcon, SearchIcon } from "react-native-heroicons/solid";
import { TabFilterEnum } from "../enum";
import { tw } from "../utils/tailwind";
import ButtonIcon from "./ButtonIcon";
import ButtonSearchWalllets from "./ButtonSearchWalllets";

const TabBarMenu = ({ tabSelected, setTabSelected }) => {

  const itemTabBar = [
    { label: "NFT", value: "NFT" },
    { label: "Token", value: "Token" },
    { label: "History", value: "History" },
  ];
  const handleChangeTab = (index: number) => {
    setTabSelected(index);
  };
  return (
    <View style={tw`flex-row items-center justify-center my-2`}>
      <ButtonSearchWalllets />
      <View
        style={tw`flex flex-row rounded-full w-2/3 bg-white justify-between  `}
      >
        {itemTabBar.map((item, index) => (
          <TouchableOpacity activeOpacity={0.6}
            onPress={() => handleChangeTab(index)}
            disabled={index === tabSelected}
            key={item.value}
            style={tw`${index === tabSelected ? "bg-gray-200" : ""
              } p-2 px-5 rounded-full`}
          >
            <Text>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ButtonIcon
        style={"mr-2"}
        icon={<PlusIcon fill={"black"} height={25} width={25} />}
        onPress={() => { }}
      />
    </View>
  );
};


export default TabBarMenu;
