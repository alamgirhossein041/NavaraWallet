import React, { useState } from "react";

import { createStackNavigator } from "@react-navigation/stack";

import NewYourWallet from "./NewYourWallet";
import WalletName from "./WalletName";
import ChooseNetwork from "./ChooseNetworks";
import PassPhrase from "./PassPhraseNew";
import PassPhraseNew from "./PassPhraseNew";
const Stack = createStackNavigator();

const NewWallet = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="NewWallet"
        component={NewYourWallet}
        
        
      />
      <Stack.Screen
        name="WalletName"
        component={WalletName}
        options={{ title: "Wallet Name" }}
        
      />
       <Stack.Screen
        name="PassPhraseNew"
        component={PassPhraseNew}
        options={{ title: "Pass Phrase" }}
        
      />
      <Stack.Screen
        name="ChooseNetwork"
        component={ChooseNetwork}
        
      />
    </Stack.Navigator>
  );
};

export default NewWallet;
