import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";
import { useQuery } from "react-query";
import Button from "../../../components/UI/Button";
import SearchBar from "../../../components/UI/SearchBar";
import { detectToken } from "../../../core/Alchemy";
import { ITokenMetadata } from "../../../data/types";
import { tw } from "../../../utils/tailwind";
import { TokenCollapsible } from "./Token";

export interface IAddTokens {
  network: string;
  walletAddress?: string;
  addedToken: string[];
  handleAddToken: (token: ITokenMetadata) => Promise<void>;
}

const DetectTokens = (props: IAddTokens) => {
  const { walletAddress, network, addedToken, handleAddToken } = props;
  const {
    isLoading,
    data: listTokens,
    isError,
    refetch,
  } = useQuery(
    [`tokens-${network}`, network],
    async (): Promise<ITokenMetadata[]> => {
      const tokenMetadata = await detectToken(network, walletAddress);
      setListTokensFiltered(tokenMetadata);
      return tokenMetadata;
    },
    {
      enabled: false,
    }
  );

  const isReady = useMemo(() => {
    return !isError && listTokens && listTokens.length > 0;
  }, [isError, listTokens]);

  const [listTokensFiltered, setListTokensFiltered] = useState(listTokens);

  const { t } = useTranslation();
  return (
    <View style={tw`flex-col items-center justify-center flex-1 w-full`}>
      {isReady ? (
        <SearchBar
          style={tw`p-2 dark:text-white`}
          placeholder={t("search_bar.search")}
          debounce={50}
          list={listTokens}
          filterProperty={["name", "contractAddress", "symbol"]}
          onListFiltered={(list: ITokenMetadata[]) => {
            setListTokensFiltered(list);
          }}
        />
      ) : (
        <Text
          style={tw`mt-5 text-base font-semibold text-center text-gray-700 dark:text-gray-200`}
        >
          {listTokens && listTokens.length === 0
            ? "No tokens found"
            : "Detect your owned tokens (up to 100)"}
        </Text>
      )}

      {isReady ? (
        <ScrollView style={tw`w-full `}>
          {listTokensFiltered &&
            listTokensFiltered.map((token, index) => {
              const isSelected = addedToken.includes(token.contractAddress);

              return (
                <View key={index}>
                  <TokenCollapsible
                    token={token}
                    isSelected={isSelected}
                    onPressAdd={() => handleAddToken(token)}
                  />
                </View>
              );
            })}
        </ScrollView>
      ) : (
        <View style={tw`absolute flex bottom-5`}>
          <Button loading={isLoading} onPress={refetch}>
            {isError ? "Retry" : `Start detecting tokens`}
          </Button>
        </View>
      )}
    </View>
  );
};

export default DetectTokens;
