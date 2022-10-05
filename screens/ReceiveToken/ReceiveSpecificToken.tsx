import React, { useState } from "react";
import { ScrollView, Switch, Text, View } from "react-native";
import { tw } from "../../utils/tailwind";
import Button from "../../components/Button";
import MenuItem from "../../components/MenuItem";
import WalletIcon from "../../assets/icons/icon-wallet.svg";
import { primaryColor, primaryGray } from "../../configs/theme";
import TokenCard from "./TokenCard";
import AmountCard from "./AmountCard";
import HeaderScreen from "../../components/HeaderScreen";
import { useDarkMode } from "../../hooks/useDarkMode";
import { useTextDarkMode } from "../../hooks/useTextDarkMode";
import { useGridDarkMode } from "../../hooks/useGridDarkMode";

const ReceiveSpecificToken = ({ navigation, route }) => {
  const token = route.params;
  const [isSpecific, setIsSpecific] = useState(false);
  const [amount, setAmount] = useState(10);
  //background Darkmode
  const modeColor = useDarkMode();
  //text darkmode
  const textColor = useTextDarkMode();
  //grid, shadow darkmode
  const gridColor = useGridDarkMode();
  return (
    <View style={tw`h-full flex-col  justify-between ${modeColor}`}>
      <View style={tw` w-full flex-1`}>
        <ScrollView style={tw`w-full flex `}>
          <View style={tw`w-full flex-col items-center justify-between p-3`}>
            {/* <View style={tw`w-full`}>
              <MenuItem
                icon={
                  <View style={tw`p-2 rounded-full bg-[${primaryColor}]`}>
                    <WalletIcon width="100%" height="100%" fill="white" />
                  </View>
                }
                iconPadding={""}
                name="Specific amount"
                disabled
                value={
                  <Switch
                    trackColor={{ false: primaryGray, true: primaryColor }}
                    thumbColor="white"
                    onValueChange={(value) => setIsSpecific(value)}
                    value={isSpecific}
                  />
                }
                next={false}
              />
            </View>
            {isSpecific && (
              <AmountCard tokenId={token.network as string} amount={amount} />
            )} */}
            <TokenCard
              token={token}
              amount={isSpecific ? amount : null}
            />
          </View>
          {/* <View style={tw`px-4`}>
            <Button
              onPress={() => {
                navigation.navigate("ShareAddress", {
                  tokenId: token.network,
                  amount: isSpecific ? amount : null,
                });
              }}
            >
              Send request
            </Button>
          </View> */}
        </ScrollView>
      </View>
    </View>
  );
};

export default ReceiveSpecificToken;
