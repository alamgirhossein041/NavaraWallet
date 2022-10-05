import React from "react";
import { View } from "react-native";
import { tw } from "../../utils/tailwind";
import ListTokenMultiChain from "./ListTokenMultiChain";
interface IWalletItemProps {
  name: string;
  icon?: JSX.Element;
  total: string;
  price: string;
}
const ListWallets = () => {
  return (
    <View style={tw`flex-1 dark:bg-gray-800`}>
      {/* <TabBarMenu tabSelected={tabSelected} setTabSelected={setTabSelected} /> */}
      <View style={tw`dark:bg-gray-800`}>
        {/* <ScreenLoading show={true}/> */}
        {/* <ListTokenMultiChain /> */}

        {/* {tabSelected === 0 &&
              wallets.map((wallet: IWalletItemProps, index) => (
                <ItemWalletViewer key={index} {...wallet} />
              ))} */}
        <ListTokenMultiChain />
        {/* {tabSelected === 2 && <HistoryWallets />} */}
      </View>
    </View>
  );
};

export default ListWallets;
