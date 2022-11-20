import Clipboard from "@react-native-clipboard/clipboard";
import { AxiosError } from "axios";
import * as WAValidator from "multicoin-address-validator";
import {
  Actionsheet,
  CheckCircleIcon,
  Spinner,
  useDisclose,
} from "native-base";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, Text, TextInput, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ShieldExclamationIcon, XMarkIcon } from "react-native-heroicons/solid";
import { useMutation } from "react-query";
import { useRecoilValue } from "recoil";
import IconUSA from "../../assets/icons/icon-usa.svg";
import ActionSheetItem from "../../components/UI/ActionSheetItem";
import Button from "../../components/UI/Button";
import CurrencyFormat from "../../components/UI/CurrencyFormat";
import ShowIconChainSelected from "../../components/UI/ShowIconChainSelected";
import { EVM_CHAINS } from "../../configs/bcNetworks";
import { primaryColor } from "../../configs/theme";
import API from "../../data/api";
import { walletEnvironmentState } from "../../data/globalState/userData";
import { NETWORKS, NETWORK_ENVIRONMENT_ENUM } from "../../enum/bcEnum";
import { getNetworkEnvironment } from "../../hooks/useBcNetworks";

import { useTranslation } from "react-i18next";

import { SelectListChains } from "../../components/UI/SelectListChains";
import { decryptAESWithKeychain } from "../../core/keychain";
import { validateAccountId } from "../../hooks/useNEAR";
import { isSameNetwork } from "../../utils/network";
import { shortenAddress } from "../../utils/stringsFunction";
import { tw } from "../../utils/tailwind";
import ScanQR from "./ScanQR";

const validateToken = async (
  address: string,
  network: string,
  env: NETWORK_ENVIRONMENT_ENUM
): Promise<boolean> => {
  let validatingNetwork = network;
  if (isSameNetwork(network, NETWORKS.NEAR)) {
    return await validateAccountId(address, env);
  } else if (EVM_CHAINS.includes(network)) {
    validatingNetwork = NETWORKS.ETHEREUM;
  }

  try {
    const result: boolean = WAValidator.validate(
      address,
      validatingNetwork.toLowerCase()
    );
    return result;
  } catch (error) {
    return false;
  }
};
const ViewSendingToken = ({ route, navigation }: any) => {
  const { isOpen, onOpen, onClose } = useDisclose();
  const [domainChecked, setDomainChecked] = useState<boolean>(false);
  const [isScam, setIsScam] = useState<boolean>(false);
  const [receiver, setReceiver] = useState<string>();
  const { token, seed } = route.params;
  const balance = token.balance || 0;
  const [resolveBy, setResolveBy] = useState<string>("");
  const walletEnvironment = useRecoilValue(walletEnvironmentState);
  const env = getNetworkEnvironment(walletEnvironment);
  const { t } = useTranslation();

  navigation.setOptions({
    title: `${t("home.send")} ${token.symbol}`,
    headerRight: () => <SelectListChains token={token} next="SendingToken" />,
  });
  // declare wallet

  // declare form
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      receiver: "",
      amount: 0,
    },
  });

  const [err, setErr] = useState({
    domain: false,
    address: false,
  });
  const onSubmit = async (data) => {
    token.privateKey = await decryptAESWithKeychain(token.privateKey);
    navigation.navigate("ConfirmTransaction", {
      token,
      seed,
      receiver: {
        domain: watch("receiver").trim(),
        address: receiver.trim(),
      },
      amount: +data.amount,
      isScam,
    });

    return;
  };

  const getNetworkType = (network: NETWORKS): string => {
    if (EVM_CHAINS.includes(network)) return NETWORKS.ETHEREUM.toLowerCase();
    return network.toLowerCase();
  };

  const resetErr = () => {
    setErr({
      domain: false,
      address: false,
    });
  };
  // input domain, return address
  const requestGetAddress = useMutation(
    (params: any) => {
      const { network, input } = params;
      if (
        isSameNetwork(network, NETWORKS.NEAR) &&
        !input.includes(".nns.one")
      ) {
        return validateAccountId(input, env).then((isValid) =>
          isValid
            ? { type: "near blockchain", address: input, isScam: false }
            : null
        );
      } else {
        return API.get("/domain/resolver/domain", {
          params,
        });
      }
    },
    {
      onError: (e: AxiosError) => {
        setDomainChecked(false);
        if (watch("receiver").length < 10 || watch("receiver").includes(".")) {
          setErr({
            ...err,
            domain: true,
          });
          return;
        } else {
          resetErr();
          setReceiver(watch("receiver"));
        }
      },
      onSuccess: (data: any) => {
        if (!!data) {
          setResolveBy(data.type);
          setReceiver(data.address);
          setDomainChecked(true);
          setIsScam(data.isScam);
        } else {
          setErr({
            address: true,
            domain: false,
          });
        }
      },
    }
  );

  // input address, return domain
  const requestGetDomain = useMutation(
    (params) => {
      return API.get("/domain/resolver/address", {
        params,
      });
    },
    {
      onError: (e: AxiosError) => {
        const data: any = e.response.data;
        setIsScam(data.isScam);
        setDomainChecked(false);
        setReceiver(watch("receiver"));
      },
      onSuccess: (data: any) => {
        setValue("receiver", data.domain);
        setDomainChecked(true);
        setIsScam(data.isScam);
        setReceiver(data.address);
      },
    }
  );

  const fetchCopiedText = async () => {
    const text = await Clipboard.getString();
    setValue("receiver", text);
    handleCheckReceiver();
  };

  /**
   * Reset all state
   */
  const clearState = () => {
    setDomainChecked(false);
    setValue("receiver", "");
    setReceiver("");
    setErr({
      domain: false,
      address: false,
    });
    setIsScam(false);
  };

  /**
   * Handle qr code result
   * @param input
   * @returns void
   */
  const handleResultQrScan = async (input: string) => {
    setValue("receiver", input);
    handleCheckReceiver();
    return;
  };

  /**
   * Handle check address / domain input
   * @returns void
   */
  const handleCheckReceiver = async () => {
    resetErr();
    const input = watch("receiver") || "";
    // check is domain
    if (input.includes(".")) {
      requestGetAddress.mutate({
        input: input,
        network: token.symbol,
      } as any);
      return;
    }

    if (await validateToken(input, token.network, env)) {
      requestGetDomain.mutate({
        input: input.trim(),
        network: token.symbol,
      } as any);
      setReceiver(input);
    } else {
      setErr({
        ...err,
        address: true,
      });
    }
  };

  return (
    <View style={tw` h-full w-full`}>
      <ScrollView style={tw`px-3`} scrollEnabled={false}>
        {/* <ShowBalanceChain chain={token} /> */}

        <View style={tw`flex-row items-center justify-between m-1`}>
          <Text style={tw`dark:text-white  text-lg font-bold`}>
            {t("send.recipient")}
          </Text>
          {domainChecked ? (
            <View style={tw`flex-row items-center justify-center `}>
              <Text
                style={tw`${isScam ? "text-black" : `text-[${primaryColor}]`}`}
              >
                {shortenAddress(receiver)}
              </Text>
            </View>
          ) : (
            <ScanQR onValueScanned={handleResultQrScan} />
          )}
        </View>

        {domainChecked ? (
          <View>
            <View
              style={tw`${
                isScam
                  ? "border-red-500 bg-red-100"
                  : `border-[${primaryColor}]  bg-blue-100`
              } flex flex-row  rounded-xl items-center text-gray-400 p-2 border h-15 `}
            >
              <View style={tw`w-7/8 tex-white items-center flex-row `}>
                <Text
                  style={tw`${
                    isScam
                      ? "text-red-500 font-bold"
                      : "text-blue-500 font-bold"
                  } mr-1`}
                >
                  {watch("receiver").trim()}
                </Text>
                {!isScam && (
                  <CheckCircleIcon
                    width={30}
                    height={30}
                    color={primaryColor}
                  />
                )}
              </View>
              <View style={tw`flex flex-row justify-end w-1/8`}>
                <XMarkIcon
                  onPress={clearState}
                  width={25}
                  height={25}
                  fill="black"
                />
              </View>
            </View>
          </View>
        ) : (
          <View
            style={tw`${
              errors.receiver || err.domain || err.address
                ? "border-red-500 bg-red-100 dark:bg-red-100 border"
                : " border-gray-100 dark:border-gray-600"
            } flex flex-row border ${
              isScam ? "border-red-500 bg-red-100" : ""
            } rounded-xl items-center  h-15 px-2`}
          >
            <Controller
              control={control}
              rules={{
                required: true,
                minLength: 3,
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  editable={
                    !requestGetAddress.isLoading || !requestGetDomain.isLoading
                  }
                  autoCapitalize="none"
                  onBlur={handleCheckReceiver}
                  onChangeText={onChange}
                  value={value}
                  style={tw`flex-1 text-black dark:text-white`}
                  placeholder={t("send.address_or_nns")}
                  autoCompleteType="off"
                  placeholderTextColo={primaryColor}
                />
              )}
              name="receiver"
            />

            <View>
              {watch("receiver") && watch("receiver").length > 0 ? (
                <View>
                  {requestGetAddress.isLoading || requestGetDomain.isLoading ? (
                    <Spinner color={primaryColor} />
                  ) : (
                    <XMarkIcon
                      onPress={clearState}
                      width={25}
                      height={25}
                      fill="gray"
                    />
                  )}
                </View>
              ) : (
                <TouchableOpacity
                  onPress={fetchCopiedText}
                  style={tw`dark:bg-gray-800 bg-gray-100  p-1 px-3 rounded-lg`}
                >
                  <Text style={tw`dark:text-white text-green-500 uppercase`}>
                    {t("send.paste")}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        {isScam && (
          <View
            style={tw`flex-row items-center justify-center mt-3 bg-red-100  p-2 rounded mx-auto`}
          >
            <ShieldExclamationIcon width={20} height={20} color="red" />
            <Text style={tw`text-center  font-bold text-red-500`}>
              Known scam address
            </Text>
          </View>
        )}
        {!domainChecked && errors.receiver && (
          <Text style={tw`text-center text-red-500 `}>
            {t("send.receiving_address_required")}
          </Text>
        )}

        {err.domain && (
          <Text style={tw` text-center text-red-500 `}>
            {t("send.domain_not_found")}
          </Text>
        )}

        {err.address && (
          <Text style={tw`text-center text-red-500 `}>
            {t("send.invalid_address")}
          </Text>
        )}

        <View style={tw`flex flex-col my-5`}>
          <View style={tw`flex-row justify-between m-1`}>
            <Text style={tw`dark:text-white  text-lg font-bold`}>
              {t("send.to_network")}
            </Text>
            <View style={tw`flex-row items-center`}>
              <ShowIconChainSelected chain={token} />
              <Text style={tw`dark:text-white  font-bold ml-2`}>
                {token.symbol}
              </Text>
            </View>
          </View>
          {/* <Text style={tw`dark:text-white  text-gray-400  mx-1`}>
            {t("send.recipient_will_receive")} {token.symbol}{" "}
            {t("send.network_as")} {token.symbol}
          </Text> */}
        </View>

        <View style={tw`flex flex-row items-center justify-between m-1`}>
          <Text style={tw`dark:text-white  text-lg font-bold`}>
            {t("send.amount")}
          </Text>
          <View style={tw`flex-row`}>
            <Text style={tw`dark:text-white  `}>~{balance.toFixed(4)} </Text>

            <Text style={tw`dark:text-white`}>
              {token.symbol} {t("send.available")}
            </Text>
          </View>
        </View>

        <View
          style={tw`${
            errors.amount
              ? "border-red-500 bg-red-100 "
              : "border-gray-100 dark:border-gray-600"
          } flex flex-row border  rounded-xl items-center text-gray-400 h-15 px-2`}
        >
          <View style={tw``}>
            <ShowIconChainSelected chain={token} />
          </View>
          <Controller
            control={control}
            rules={{
              required: true,
              validate: (value) => value > 0,
            }}
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                value={value !== 0 ? value.toString() : ""}
                keyboardType="numeric"
                onBlur={onBlur}
                onChangeText={onChange}
                onEndEditing={() =>
                  setValue("amount", +value.toString().replace(/,/g, "."))
                }
                style={tw`w-full p-4  dark:text-white`}
                placeholder={t("send.enter_amount")}
                // placeholderTextColor={'gray'}
              />
            )}
            name="amount"
          />

          {/* <View style={tw`flex-row ml-auto`}>
            <TouchableOpacity
              onPress={() => setValue("amount", balance)}
              underlayColor="transparent"
              style={tw`dark:bg-gray-800 bg-gray-100  p-1 px-3 rounded-lg`}
            >
              <Text style={tw`dark:text-white  text-green-500`}>
                {t("send.max")}
              </Text>
            </TouchableOpacity>
          </View> */}
        </View>
        <View style={tw`py-5 mx-2`}>
          <Text style={tw`text-lg`}>≈</Text>
        </View>
        <View
          style={tw`flex flex-row border py-3 px-2 border-gray-100 dark:border-gray-600 h-15  rounded-xl items-center text-gray-400`}
        >
          <View>
            <IconUSA />
          </View>
          <View>
            <CurrencyFormat
              value={+watch("amount") * token.price}
              style="m-1 italic text-sm"
            />
          </View>
          <View style={tw`ml-auto`}>
            <Text style={tw`dark:text-white`}>USD</Text>
          </View>
        </View>
      </ScrollView>

      {receiver &&
      !requestGetAddress.isLoading &&
      !requestGetDomain.isLoading ? (
        <View style={tw`absolute w-full px-4 bottom-5`}>
          <Button onPress={isScam ? onOpen : handleSubmit(onSubmit)}>
            {t("send.continue")}
          </Button>
        </View>
      ) : (
        <></>
      )}

      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content style={tw``}>
          <View
            style={tw`flex-row items-center justify-center mt-3 bg-red-100  p-2 rounded mx-auto`}
          >
            <ShieldExclamationIcon width={20} height={20} color="red" />
            <Text style={tw`text-center  font-bold text-red-500`}>
              Known scam address
            </Text>
          </View>
          <ActionSheetItem onPress={onClose}>
            <Text style={tw`dark:text-white  font-bold text-lg `}>
              {t("send.cancel")}
            </Text>
          </ActionSheetItem>
          <ActionSheetItem onPress={handleSubmit(onSubmit)}>
            <View style={tw`flex-row items-center justify-between w-full`}>
              <Text style={tw`dark:text-white  text-lg text-red-500`}>
                {t("send.continue_transaction")}
              </Text>
            </View>
          </ActionSheetItem>
        </Actionsheet.Content>
      </Actionsheet>
    </View>
  );
};

const SendingToken = (props) => {
  return <ViewSendingToken {...props} />;
};
export default SendingToken;
