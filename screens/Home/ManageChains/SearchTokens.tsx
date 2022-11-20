import debouce from "lodash.debounce";
import { Spinner } from "native-base";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useQuery } from "react-query";
import Button from "../../../components/UI/Button";
import TextField from "../../../components/UI/TextField";
import { primaryColor } from "../../../configs/theme";
import { getTokenMetadata } from "../../../core/Alchemy";
import { ITokenMetadata } from "../../../data/types";
import { tw } from "../../../utils/tailwind";
import { IAddTokens } from "./DetectTokens";
import { TokenCollapsible } from "./Token";

const SearchTokens = (props: IAddTokens) => {
  const { network, addedToken, handleAddToken } = props;
  const [searchValue, setSearchValue] = useState("");
  const {
    isLoading,
    data: listTokens,
    isError,
    refetch,
  } = useQuery(
    [`tokens-${network}`, network, searchValue],
    async (): Promise<ITokenMetadata[]> => {
      if (searchValue?.length > 0) {
        const metadata = await getTokenMetadata(network, {
          contractAddress: searchValue,
        });
        if (metadata) {
          return [metadata];
        }
      }
      return [];
    }
  );

  const debouncedResults = useMemo(() => {
    return debouce(async (text) => {
      setSearchValue(text);
    }, 200);
  }, []);

  useEffect(() => {
    return () => {
      debouncedResults.cancel();
    };
  }, [debouncedResults]);

  return (
    <View style={tw`flex-col items-center justify-center flex-1 w-full`}>
      <TextField
        type={"search"}
        placeholder={"Search"}
        onChangeText={debouncedResults}
      />
      <ScrollView style={tw`w-full h-full`}>
        {isLoading && (
          <View style={tw`mt-2`}>
            <Spinner color={primaryColor} />
          </View>
        )}
        {listTokens && listTokens.length > 0 ? (
          listTokens.map((token, index) => {
            const isSelected = addedToken.includes(token?.contractAddress);
            return (
              <View key={index}>
                <TokenCollapsible
                  token={token}
                  isSelected={isSelected}
                  onPressAdd={() => handleAddToken(token)}
                />
              </View>
            );
          })
        ) : (
          <Text
            style={tw`mt-5 text-base font-semibold text-center text-gray-700 dark:text-gray-200`}
          >
            Type the token name or address
          </Text>
        )}
      </ScrollView>
      {isError && (
        <View style={tw`absolute flex-col mt-2 bottom-5`}>
          <Text
            style={tw`mt-5 text-base font-semibold text-center text-gray-700 dark:text-gray-200`}
          >
            Something went wrong
          </Text>
          <Button loading={isLoading} onPress={refetch}>
            Retry
          </Button>
        </View>
      )}
    </View>
  );
};

export default SearchTokens;
