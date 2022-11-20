import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { PlusCircleIcon } from "react-native-heroicons/solid";
import { primaryColor } from "../../../configs/theme";
import { FungibleTokens } from "../../../data/database/entities/fungibleTokens";
import useFungibleTokenActions from "../../../data/globalState/fungibleToken/fungibleToken.actions";
import { capitalizeFirstLetter } from "../../../utils/stringsFunction";
import { tw } from "../../../utils/tailwind";
import toastr from "../../../utils/toastr";
import { TokenCollapsible } from "./Token";

const TokenList = ({
  chain,
  walletId,
}: {
  chain: string;
  walletId: string;
}) => {
  const navigation = useNavigation();
  const fungibleTokenActions = useFungibleTokenActions();

  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
  const [listTokens, setListTokens] = useState<FungibleTokens[]>([]);

  useEffect(() => {
    const list = fungibleTokenActions
      .get(walletId)
      .filter((token) => token.network === chain);
    setListTokens(list);
  }, [chain, walletId]);

  return (
    <View style={tw`flex-col w-full p-3`}>
      <View style={tw`flex-col`}>
        {listTokens?.length > 0 &&
          listTokens.map((token, index) => {
            const isCollapsed = index !== selectedIndex;

            return (
              <View key={index}>
                <TokenCollapsible
                  token={token}
                  onPressRemove={async () => {
                    const newListToken = await fungibleTokenActions.remove(
                      walletId,
                      token.id
                    );
                    toastr.success("Token removed");
                    setListTokens(newListToken);
                  }}
                />
              </View>
            );
          })}
      </View>
      <TouchableOpacity
        style={tw`flex-row items-center justify-center w-full mt-1`}
        onPress={() =>
          navigation.replace(
            "AddToken" as never,
            {
              chain: chain,
            } as never
          )
        }
      >
        <PlusCircleIcon width={20} height={20} color={primaryColor} />
        <Text
          style={tw`pl-1 font-semibold text-center text-gray-700 dark:text-gray-200`}
        >
          {`Add ${capitalizeFirstLetter(chain.split("_")[0])} token`}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TokenList;
