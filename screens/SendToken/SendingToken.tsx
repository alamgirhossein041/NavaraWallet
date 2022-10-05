import { View, Text, TextInput } from "react-native";
import React from "react"
import { tw } from "../../utils/tailwind";
import Button from "../../components/Button";
import { useWallet } from "../../hooks/useWallet";
import { useEffect } from "react";
import { useState } from "react";
import ScanAddressQR from "./ScanAddressQR";
import { useForm, Controller } from "react-hook-form";
import { CHAIN_ICONS, NETWORK_COINGEKO_IDS } from "../../configs/bcNetworks";
import { useMutation, useQueries, useQuery } from "react-query";
import API, { URL_GET_PRICE } from "../../data/api";
import { XIcon } from "react-native-heroicons/solid";
import { primaryColor } from "../../configs/theme";
import { CheckCircleIcon, Spinner } from "native-base";
import toastr from "../../utils/toastr";
import usePopupResult from "../../hooks/usePopupResult";
import { NETWORKS } from "../../enum/bcEnum";
const SendingToken = ({ route, navigation }: any) => {
  const [domainChecked, setDomainChecked] = useState<boolean>(false)
  const [receiver, setReceiver] = useState<string>()
  const [balance, setBalance] = useState<number>(0)
  const { token, seed } = route.params;
  const currency = "usd"
  // declare wallet
  const { getBalanceOf, address, transfer, error, near }: any = useWallet({ network: token.network, mnemonic: seed, privateKey: token.privateKey })

  // declare form
  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      receiver: '',
      amount: 0
    }
  });


  const { data, isLoading } = useQuery(["getPrice"], async () => {
    const response = await API.get(URL_GET_PRICE, {
      params: {
        ids: NETWORK_COINGEKO_IDS[token.network],
        vs_currencies: currency
      }
    })
    return response[NETWORK_COINGEKO_IDS[token.network]][currency]
  });

  const rate = data ? data : 0


  const popupResult = usePopupResult()
  const [sending, setSending] = useState(false)

  const onSubmit = data => {
    setSending(true)
    transfer(receiver, data.amount).then((response) => {
      toastr.success("Success")
      popupResult({
        title: 'Successful transfer',
        isOpen: true,
        type: "success"
      })
      navigation.goBack()
    }).catch(e => {
      popupResult({
        title: 'Transfer failed',
        isOpen: true,
        type: "error"
      })
    }).finally(() => {
      setSending(false)
    })
  };

  const getBalance = (publicKey) => {
    getBalanceOf(address).then((response: any) => {
      setBalance(+response)
      setLoadingBalance(false)
    }).catch((e) => {
      // load balance err
    }).finally(() => {
      setLoadingBalance(false)
    })
  }

  const [loadingBalance, setLoadingBalance] = useState(true)
  useEffect(() => {
    if (!!address && token.network !== NETWORKS.NEAR) {
      getBalance(address)
    }
    else if (!!near) {
      getBalance(address)
    }
  }, [address, near])

  const requestGetAddess = useMutation(params => {
    return API.get('/domain/resolver', {
      params
    })
  }, {
    onError: (e) => {
      setDomainChecked(false)
    },
    onSuccess: (data: string) => {
      setDomainChecked(true)
      if (!data || data.length === 0) {
        return
      }
      if (data.length < 10) {
        setValue("receiver", data)
      }
      else if (data.length > 30) {
        setValue("receiver", data)
        setReceiver(data)
      }
    }
  })

  const handleResultQrScan = (input: string) => {
    requestGetAddess.mutate({ input } as any)
    setValue("receiver", input)
    setReceiver(input)
  }

  const handleClearInput = () => {
    setDomainChecked(false)
    setValue("receiver", "")
    setReceiver("")
  }

  const handleOnBlurInputAddress = () => {
    handleResultQrScan(watch("receiver"))
  }

  const Icon = CHAIN_ICONS[token.network]
  return (
    <View style={tw`bg-white h-full px-4 py-2 relative dark:bg-gray-800`}>

      <View style={tw`flex flex-row bg-[#F8F8F8] rounded-full flex-row text-gray-400 mb-5 p-3 items-center justify-between `}>
        <View style={tw`flex-row`}>
          <View style={tw`mr-2 h-10`}>
            <Icon width={40} height={40} />
          </View>
          <View style={tw`mr-2 h-10 items-center flex-col flex `}>
            <Text style={tw`font-bold uppercase `}>{token.network}</Text>
            <Text style={tw``}>${balance.toFixed(2)}</Text>
          </View>
        </View>
        {loadingBalance ? <Spinner /> :
          <View>
            <Text style={tw`font-bold uppercase`}>{balance.toFixed(4)}</Text>
            {balance !== 0 && <Text style={tw`font-bold uppercase`}>{`$n ${(balance * rate).toFixed(2)}`}</Text>}
          </View>
        }

      </View>
      <Text style={tw`font-bold m-3 dark:text-white`}>To address : </Text>
      {domainChecked ? <View
        style={tw`border-[${primaryColor}] border bg-[#edfffe] flex flex-row  rounded-full items-center text-gray-400 py-3 px-5  `}
      >
        <View style={tw`w-7/8 text-[${primaryColor}] items-center flex-row `}>
          <Text style={tw`text-[${primaryColor}] mr-1`}  >
            {watch("receiver")}
          </Text>
          {watch("receiver").length < 30 && <CheckCircleIcon width={30} height={30} color={primaryColor} />}
        </View>
        <View style={tw`flex w-1/8 flex-row flex-row justify-end`}>
          <XIcon onPress={handleClearInput} width={25} height={25} fill="black" />
        </View>
      </View> : <View
        style={tw`${errors.receiver ? "border-red-500 bg-red-100 border" : "bg-[#F8F8F8]"} flex flex-row  rounded-full items-center text-gray-400 py-3 px-5  `}
      >
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              onBlur={handleOnBlurInputAddress}
              onChangeText={onChange}
              value={value}
              style={tw`w-7/8`}
              placeholder="Enter receiving address"
              autoCompleteType="off"

            />
          )}
          name="receiver"
        />

        <View style={tw`flex w-1/8 flex-row flex-row justify-end`}>
          {watch("receiver").length > 0 ? <XIcon onPress={handleClearInput} width={25} height={25} fill="black" /> : <ScanAddressQR onValueScaned={handleResultQrScan} />}
        </View>
      </View>}

      {!domainChecked && errors.receiver && <Text style={tw`text-center text-red-500 `}>Receiving address required.</Text>}
      <View style={tw`flex flex-row mt-5`}>
        <Text style={tw`font-bold m-3 dark:text-white`}>Amount : </Text>
      </View>
      <View
        style={tw`${errors.amount ? "border-red-500 bg-red-100 border" : "bg-[#F8F8F8]"} flex flex-row  rounded-full  text-gray-400 py-3 px-5`}
      >
        <Controller
          control={control}
          rules={{
            required: true,
            validate: (value) => value > 0 || value > balance,
          }}
          render={({ field: { onChange, onBlur } }) => (
            <TextInput
              keyboardType="numeric"
              onBlur={onBlur}
              onChangeText={onChange}
              style={tw`w-7/8`}
              placeholder="Enter amount"
            />
          )}
          name="amount"
        />

      </View>
      {/* {errors.amount && <Text style={tw`text-center text-red-500`}>Amount required.</Text>} */}
      {!loadingBalance && <View style={tw`absolute bottom-5 left-4 right-4  w-full`}>
        <Button
          loading={sending}
          stringStyle="text-center text-xl font-medium text-white"
          onPress={handleSubmit(onSubmit)}
        >
          Confirm
        </Button>
      </View>}
    </View>
  );
};

export default SendingToken;
