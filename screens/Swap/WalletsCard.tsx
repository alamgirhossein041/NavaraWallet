import React from "react";
import { Text, View } from "react-native";
import WalletAvatar from "../../components/UI/WalletAvatar";
import { primaryColor } from "../../configs/theme";
import { useWalletSelected } from "../../hooks/useWalletSelected";
import { shortenAddress } from "../../utils/stringsFunction";
import { tw } from "../../utils/tailwind";

const WalletsCard = ({ address }) => {
  // const [listWallets, setListWallets] = useRecoilState(listWalletsState);
  const walletSelected = useWalletSelected();
  const walletData = walletSelected?.data;

  return (
    <View
      style={tw`flex-row items-center w-full py-2 px-1 border rounded-lg border-[${primaryColor}]`}
    >
      <WalletAvatar domain={walletData?.domain} />
      <View style={tw`ml-2`}>
        <Text style={tw`dark:text-white  text-lg font-semibold`}>
          {walletData?.domain}
        </Text>
        <Text style={tw`dark:text-white  text-xs text-gray-400`}>
          {shortenAddress(address, 36)}
        </Text>
      </View>
    </View>
  );
};

export default WalletsCard;
