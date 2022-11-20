import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { DocumentDuplicateIcon } from "react-native-heroicons/outline";
import { LockClosedIcon } from "react-native-heroicons/solid";
import { primaryColor } from "../../configs/theme";
import { useWalletSelected } from "../../hooks/useWalletSelected";
import getAvatar from "../../utils/getAvatar";
import getDomainFromUrl from "../../utils/getDomainFromUrl";
import { formatBalance } from "../../utils/number";
import { shortenAddress } from "../../utils/stringsFunction";
import { tw } from "../../utils/tailwind";
import Favicon from "./Favicon";

const MAX_FEE_RATE = 1.13;

export function ConfirmTransactionModal(props: any) {
  const { url, selectedAddress, transaction, favicon, provider, gasPrice } =
    props;
  const shortenSelectedAddress = shortenAddress(selectedAddress);
  const { data: selectedWallet, index: walletIndex } = useWalletSelected();
  const [baseFee, setBaseFee] = useState<string>("0");
  const [maxFee, setMaxFee] = useState<string>("0");
  const [balance, setBalance] = useState<string>();
  const [isEnoughBalance, setIsEnoughBalance] = useState<boolean>();
  const [lackingBalance, setLackingBalance] = useState<number>();

  const estimateGasFee = async (tx) => {
    try {
      const gas = new ethers.utils.BigNumber(tx.gas);
      const gasFee = gas.mul(gasPrice);
      const gasBase = ethers.utils.formatEther(gasFee);
      const maxGasFee = parseFloat(gasBase) * MAX_FEE_RATE;
      setMaxFee(formatBalance(maxGasFee.toString()));
      setBaseFee(formatBalance(gasBase.toString()));
    } catch (e) {
      setMaxFee("(non estimated)");
      setBaseFee("(non estimated)");
    }
  };

  useEffect(() => {
    estimateGasFee(transaction);
  }, [transaction, gasPrice]);

  useEffect(() => {
    if (selectedAddress && provider) {
      provider.getBalance(selectedAddress).then((result) => {
        const formatted = ethers.utils.formatEther(result);
        setBalance(formatted);
      });
    }
  }, [provider, selectedAddress]);

  useEffect(() => {
    if (balance && maxFee) {
      const estimatedRemainingBalance =
        parseFloat(balance) - parseFloat(maxFee);
      setIsEnoughBalance(estimatedRemainingBalance > 0);
      setLackingBalance(-estimatedRemainingBalance);
    }
  }, [balance, maxFee]);

  return (
    <View style={tw`flex-column items-center w-100  justify-center w-full`}>
      <Favicon url={favicon} />
      <View style={tw`flex-row items-center mb-3`}>
        <LockClosedIcon color="black" size={15} />
        <Text>{getDomainFromUrl(url)}</Text>
      </View>
      <Text style={tw`font-bold text-xl mb-5 text-black dark:text-white`}>
        Grant access to your USDT
      </Text>

      <Text style={tw`text-center mb-5 text-black dark:text-white`}>
        By granting permission, you are giving the following contract access to
        your funds.
      </Text>

      <View style={tw`mb-5 flex-row items-center`}>
        <Text>Contract:</Text>
        <TouchableOpacity
          style={tw`flex-row mx-1 rounded-full bg-blue-100 p-1 items-center`}
        >
          <Image
            style={tw`w-4 h-4 rounded-full`}
            source={{
              uri: getAvatar(walletIndex || 0),
            }}
          />
          <View>
            <Text style={tw` text-sm mx-1 text-black dark:text-white`}>
              {shortenAddress(transaction?.to || "")}
            </Text>
          </View>
          <DocumentDuplicateIcon color={primaryColor} />
        </TouchableOpacity>
      </View>
      <View
        style={tw`flex-row items-center w-full p-3  mb-3 border border-gray-300 rounded-lg`}
      >
        <Image
          style={tw`w-8 h-8 rounded-full`}
          source={{
            uri: getAvatar(walletIndex || 0),
          }}
        />
        <View style={tw`mx-2`}>
          <Text style={tw`font-bold text-black dark:text-white`}>
            {selectedWallet?.name || `Wallet ${walletIndex + 1}`} (
            {shortenSelectedAddress})
          </Text>
        </View>
      </View>
      <View
        style={tw`flex-col w-full p-3 mb-3 border border-gray-300 rounded-lg`}
      >
        <View style={tw`flex-row justify-between w-full mb-2`}>
          <Text style={tw`font-bold`}>Gas fee estimate</Text>
          <Text style={tw`font-bold text-blue-500`}>{baseFee} ETH</Text>
        </View>
        <View style={tw`flex-row justify-between w-full`}>
          <Text style={tw`font-bold`} />
          <View style={tw`flex-row`}>
            <Text style={tw`font-bold`}>Max fee: </Text>
            <Text style={tw``}>{maxFee} ETH</Text>
          </View>
        </View>
      </View>
      {isEnoughBalance && (
        <View
          style={tw`mb-5 rounded-lg bg-red-100 w-full text-center p-1 border-red-700 border`}
        >
          <Text style={tw`text-center`}>
            You need an additional {formatBalance(lackingBalance.toString())}{" "}
            ETH to complete this transaction
          </Text>
        </View>
      )}
    </View>
  );
}
