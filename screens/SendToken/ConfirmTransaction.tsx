import { Skeleton, Spinner } from "native-base";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import {
  CheckCircleIcon,
  ShieldExclamationIcon,
} from "react-native-heroicons/solid";
import { useRecoilValue } from "recoil";
import Button from "../../components/UI/Button";
import CurrencyFormat from "../../components/UI/CurrencyFormat";
import FormatToken from "../../components/UI/FormatToken";
import SignPinCode from "../../components/UI/SignPinCode";
import { CHAIN_ICONS } from "../../configs/bcNetworks";
import { primaryColor } from "../../configs/theme";
import { appLockState } from "../../data/globalState/appLock";
import { WalletInterface } from "../../data/types";
import { NETWORKS } from "../../enum/bcEnum";
import usePopupResult from "../../hooks/usePopupResult";
import { useWallet } from "../../hooks/useWallet";
import { useWalletSelected } from "../../hooks/useWalletSelected";
import { formatBalance } from "../../utils/number";
import { shortenAddress } from "../../utils/stringsFunction";
import { tw } from "../../utils/tailwind";
export default function ConfirmTransaction({ route, navigation }) {
  const appLock = useRecoilValue(appLockState);
  const { seed, receiver, amount, token, isScam } = route.params;
  const walletSelected = useWalletSelected();
  const [loadingBalance, setLoadingBalance] = useState(true);
  const popupResult = usePopupResult();
  const [balance, setBalance] = useState(0);
  const [sending, setSending] = useState(false);
  const [fee, setFee] = useState(0);
  const { t } = useTranslation();
  navigation.setOptions({
    title: `${t("home.send")} ${token.symbol}`,
  });
  const Icon = CHAIN_ICONS[token.network];
  const {
    getBalanceOf,
    transfer,
    error,
    near,
    provider,
    estimateGas,
    connection,
  }: WalletInterface = useWallet({
    network: token.network,
    mnemonic: seed,
    privateKey: token.privateKey,
  });

  const getBalance = async (address) => {
    setLoadingBalance(true);
    try {
      const gasFee = await estimateGas({
        amount,
        receiver: address,
      });
      setFee(+gasFee);
    } catch (e) {
      setFee(0);
    }
    const resultBalance = await getBalanceOf(address);

    setBalance(+resultBalance);
    setLoadingBalance(false);
  };

  useEffect(() => {
    if (near || provider || connection) {
      getBalance(token.address);
    }
  }, [token.address, provider, near, connection]);

  const handleTransfer = () => {
    setSending(true);
    transfer(receiver.address, amount)
      .then((response) => {
        navigation.replace("ResultTransaction", {
          card: <CardDetailTransaction />,
          ...route.params,
        });
      })
      .catch((e) => {
        popupResult({
          title: "Transfer failed",
          isOpen: true,
          type: "error",
        });
      })
      .finally(() => {
        setSending(false);
      });
  };
  const CardDetailTransaction = () => {
    return (
      <View>
        <View style={tw`flex-row items-center justify-between mb-3`}>
          <Text style={tw`dark:text-white`}>{t("send.from")}</Text>
          <View style={tw`flex-col items-end `}>
            <View style={tw`flex-row items-center`}>
              <Text
                style={tw`dark:text-white  text-[${primaryColor}] mr-1 font-bold`}
              >
                {walletSelected.data.name ||
                  `Wallet ${walletSelected.index + 1}`}
              </Text>
            </View>
            <Text style={tw`dark:text-white`}>
              {shortenAddress(token.address)}
            </Text>
          </View>
        </View>
        <View style={tw`flex-row items-center justify-between mb-3`}>
          <Text style={tw`dark:text-white`}>{t("send.to")}</Text>
          <View>
            {receiver.domain === receiver.address ? (
              <Text style={tw`dark:text-white`}>
                {shortenAddress(receiver.address)}
              </Text>
            ) : (
              <View style={tw`flex-col items-end `}>
                <View style={tw`flex-row items-center`}>
                  <Text
                    style={tw`${
                      isScam
                        ? "text-red-500 font-bold"
                        : `text-[${primaryColor}] mr-1 font-bold`
                    } mr-1`}
                  >
                    {receiver.domain.toLowerCase()}
                  </Text>
                  {isScam && (
                    <Text style={tw`font-bold text-red-500 dark:text-white`}>
                      (scam)
                    </Text>
                  )}
                  {!isScam ? (
                    <CheckCircleIcon
                      width={20}
                      height={20}
                      color={primaryColor}
                    />
                  ) : (
                    <ShieldExclamationIcon width={20} height={20} color="red" />
                  )}
                </View>
                <Text
                  style={tw`dark:text-white  ${isScam ? "text-red-500" : ""}`}
                >
                  {shortenAddress(receiver.address)}
                </Text>
              </View>
            )}
          </View>
        </View>
        <View style={tw`flex-row justify-between mb-3`}>
          <View style={tw`flex-row items-center`}>
            <Text style={tw`dark:text-white`}>{t("send.amount")}:</Text>
            {/*  <Text style={tw`mx-1 font-bold dark:text-white`}>{`${fee} ${token.symbol}`}</Text> */}
          </View>
          {loadingBalance ? (
            <Skeleton startColor={"gray.200"} rounded="lg" h={"3"} w={"24"} />
          ) : (
            <Text
              style={tw`font-bold dark:text-white `}
            >{`${amount} ${token.symbol}`}</Text>
          )}
        </View>
        <View style={tw`flex-row justify-between mb-3`}>
          <View style={tw`flex-row items-center dark:text-white`}>
            <Text style={tw`dark:text-white`}>{t("send.fee")}</Text>
            {/*  <Text style={tw`mx-1 font-bold dark:text-white`}>{`${fee} ${token.symbol}`}</Text> */}
          </View>
          {loadingBalance ? (
            <Skeleton startColor={"gray.200"} rounded="lg" h={"3"} w={"24"} />
          ) : (
            <Text style={tw`font-bold dark:text-white `}>
              ~ {`${formatBalance(fee.toString())} ${token.symbol}`}
            </Text>
          )}
        </View>
        <View style={tw`mb-3 border-b border-gray-300`} />
        <View style={tw`flex-row items-center justify-between`}>
          <Text style={tw`text-lg font-bold dark:text-white`}>
            {t("send.total")}
          </Text>
          {loadingBalance ? (
            <Skeleton startColor={"gray.400"} rounded="lg" h={"3"} w={"16"} />
          ) : (
            <CurrencyFormat
              value={minusAmount * token.price}
              style="font-bold text-lg dark:text-white"
            />
          )}
        </View>
      </View>
    );
  };

  const minusAmount = token.symbol === NETWORKS.NEAR ? +amount + fee : +amount;
  return (
    <View
      style={tw`relative h-full px-4 bg-white dark:bg-[#18191A] dark:border-gray-100 `}
    >
      <View style={tw`flex-row justify-center w-full mb-4`}>
        <Icon height={60} width={60} />
      </View>
      {loadingBalance ? (
        <View style={tw`flex-row justify-center mb-5`}>
          <Skeleton startColor={"gray.200"} rounded="lg" h={"8"} w={"32"} />
        </View>
      ) : (
        <View style={tw`flex-row justify-center`}>
          <Text style={tw`text-3xl font-bold dark:text-white`}>-</Text>
          <FormatToken
            style="mb-5 text-3xl font-bold text-center dark:text-white "
            value={parseFloat(amount)}
            network={token.symbol}
          />
        </View>
      )}

      <View
        style={[
          tw`w-full p-4 bg-white dark:bg-[#18191A]  shadow rounded-2xl ios:border ios:border-gray-100 dark:border-gray-600`,
        ]}
      >
        <CardDetailTransaction />
      </View>
      <Text
        style={tw`mx-3 my-1 text-xs italic text-right text-gray-400 dark:text-white`}
      >
        {`1 ${token.symbol} = ${token.price}$`}
      </Text>
      {isScam && (
        <View
          style={tw`items-center py-5 my-5 bg-red-100 border border-red-500 rounded-lg`}
        >
          <ShieldExclamationIcon width={30} height={30} color="red" />
          <Text style={tw`text-lg font-bold text-red-500 dark:text-white`}>
            {t("send.scam_warning")}
          </Text>
        </View>
      )}
      {!loadingBalance ? (
        <View style={tw`absolute w-full bottom-5 left-4 right-4`}>
          {balance < amount ? (
            <View style={tw`p-3 bg-orange-100 rounded-lg dark:bg-red-500`}>
              <Text
                style={tw`text-lg font-bold text-center text-red-500 dark:text-white `}
              >
                {t("send.not_enough_balance")}
              </Text>
            </View>
          ) : (
            <View>
              <Button
                loading={sending}
                stringStyle="text-center text-xl font-medium text-white"
                onPress={handleTransfer}
              >
                {t("send.confirm")}
              </Button>
              {appLock.transactionSigning && <SignPinCode />}
            </View>
          )}
        </View>
      ) : (
        <Spinner size={60} color={primaryColor} />
      )}
    </View>
  );
}
