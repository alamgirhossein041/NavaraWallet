import React from "react";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { tw } from "../../utils/tailwind";
import IconEyeSecret from "../../assets/icons/icon-eye-secret.svg";
import IconEye from "../../assets/icons/icon-eye.svg";

const YourBalance = () => {
  const HIDDEN_VALUE = "****";
  const [balance, setBalance] = React.useState({
    price: "10,233,550",
    btc: "258.91",
  });
  const [show, setShow] = React.useState(false);
  return (
    <View style={tw`items-center justify-between flex-col dark:bg-gray-800`}>
      <TouchableOpacity activeOpacity={0.6}
        style={tw`flex-row items-center justify-center `}
        onPress={() => setShow(!show)}
      >
        <Text style={tw`text-[#8E8E93] text-2xl mr-2 mb-2`}>Your Balance</Text>
        <View>
          {show ? (
            <IconEyeSecret height={25} width={25} />
          ) : (
            <IconEye height={25} width={25} />
          )}
        </View>
      </TouchableOpacity>
      <Text style={tw`text-black text-4xl mb-2`}>
        {show ? `$ ${balance.price}` : HIDDEN_VALUE}
      </Text>
      <Text style={tw`text-[#8E8E93] text-2xl mb-2`}>
        {show ? ` ${balance.btc}` : HIDDEN_VALUE} BTC
      </Text>
    </View>
  );
};

export default YourBalance;
