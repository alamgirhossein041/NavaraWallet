import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import TabBarMenu from "../../../components/UI/TabBarMenu";
import { CHAIN_ICONS } from "../../../configs/bcNetworks";
import { primaryColor } from "../../../configs/theme";
import useFungibleTokenActions from "../../../data/globalState/fungibleToken/fungibleToken.actions";
import { ITokenMetadata } from "../../../data/types";
import { useBcNetworks } from "../../../hooks/useBcNetworks";
import { useWalletSelected } from "../../../hooks/useWalletSelected";
import { capitalizeFirstLetter } from "../../../utils/stringsFunction";
import { tw } from "../../../utils/tailwind";
import toastr from "../../../utils/toastr";
import DetectTokens from "./DetectTokens";
import SearchTokens from "./SearchTokens";

const AddToken = ({ route, navigation }) => {
  const { chain } = route.params;
  const Icon = chain?.length > 0 ? CHAIN_ICONS[chain] : CHAIN_ICONS.ETHEREUM;
  const fungibleTokenActions = useFungibleTokenActions();
  const { data: wallet } = useWalletSelected();
  const { ALCHEMY_NETWORKS } = useBcNetworks();
  const network = ALCHEMY_NETWORKS[chain];

  const [addedToken, setAddedToken] = useState<string[]>([]);
  const walletAddress = useMemo(() => {
    return wallet?.chains.find((c) => c.network === chain)?.address;
  }, [chain, wallet?.chains]);

  useEffect(() => {
    navigation.setOptions({
      title: `Add ${capitalizeFirstLetter(chain?.split("_")[0])} token`,
      headerRight: () => {
        return (
          <View style={tw`border rounded-full border-[${primaryColor}]`}>
            <Icon width={36} height={36} />
          </View>
        );
      },
    });
  }, [navigation, chain, Icon]);

  useEffect(() => {
    const addressArray = fungibleTokenActions
      .get(wallet.id)
      .map((t) => t.contractAddress);
    setAddedToken(addressArray);
  }, [wallet.id]);

  const handleAddToken = async (token: ITokenMetadata) => {
    try {
      const fungibleToken = await fungibleTokenActions.create(wallet.id, {
        ...token,
        network: chain,
      });
      if (fungibleToken) {
        toastr.success(`Added ${fungibleToken.symbol} successfully`);
        setAddedToken([...addedToken, token.contractAddress]);
      }
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <View
      style={tw`flex-col items-center justify-start w-full p-4 h-full rounded-t-3xl bg-white dark:bg-[#18191A]`}
    >
      <TabBarMenu itemTabBar={["Search", "Detect"]} style={`w-full`}>
        <SearchTokens
          network={network}
          addedToken={addedToken}
          setAddedToken={setAddedToken}
          handleAddToken={handleAddToken}
        />

        <DetectTokens
          network={network}
          walletAddress={walletAddress}
          addedToken={addedToken}
          setAddedToken={setAddedToken}
          handleAddToken={handleAddToken}
        />
      </TabBarMenu>
    </View>
  );
};

export default AddToken;
