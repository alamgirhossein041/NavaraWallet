import { ethers } from "ethers";
import { t } from "i18next";
import { Actionsheet, useDisclose } from "native-base";
import React, { useCallback, useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { DuplicateIcon } from "react-native-heroicons/outline";
import { LockClosedIcon } from "react-native-heroicons/solid";
import Button from "../../components/UI/Button";
import { primaryColor } from "../../configs/theme";
import usePopupResult from "../../hooks/usePopupResult";
import { useWalletSelected } from "../../hooks/useWalletSelected";
import getAvatar from "../../utils/getAvatar";
import getDomainFromUrl from "../../utils/getDomainFromUrl";
import { formatBalance } from "../../utils/number";
import { shortenAddress } from "../../utils/stringsFunction";
import { tw } from "../../utils/tailwind";
import { createResponseMessage } from "../../utils/web3Message";
import Favicon from "./Favicon";

interface IConfirmTransactionModalProps {
  url: string;
  isOpen: boolean;
  closeModal: (approval: boolean) => void;
  selectedAddress: string;
  transaction: any;
  favicon: string;
  provider: ethers.providers.BaseProvider;
  gasPrice: ethers.utils.BigNumber;
}

const MAX_FEE_RATE = 1.13;

export function ConfirmTransactionModal(props: IConfirmTransactionModalProps) {
  const {
    url,
    isOpen,
    closeModal,
    selectedAddress,
    transaction,
    favicon,
    provider,
    gasPrice,
  } = props;
  const shortenSelectedAddress = shortenAddress(selectedAddress);
  const { data: selectedWallet, index: walletIndex } = useWalletSelected();
  const [baseFee, setBaseFee] = useState<string>("0");
  const [maxFee, setMaxFee] = useState<string>("0");
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
  }, [transaction, provider, gasPrice]);

  const handleApprove = () => {
    setIsLoading(true);
    closeModal(true);
  };

  return (
    <Actionsheet isOpen={isOpen} onClose={() => closeModal(false)}>
      <Actionsheet.Content style={tw`bg-white dark:bg-[#18191A]`}>
        <Favicon url={favicon} />
        <View style={tw`flex-row items-center mb-3`}>
          <LockClosedIcon color="black" size={15} />
          <Text>{getDomainFromUrl(url)}</Text>
        </View>
        <Text style={tw`font-bold text-xl mb-5 text-black dark:text-white`}>
          Grant access to your USDT
        </Text>

        <Text style={tw`text-center mb-5 text-black dark:text-white`}>
          By granting permission, you are giving the following contract access
          to your funds.
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
            <DuplicateIcon color={primaryColor} />
          </TouchableOpacity>
        </View>
        <View
          style={tw`flex-row items-center w-full p-3 mb-3 border border-gray-300 rounded-lg`}
        >
          <Image
            style={tw`w-8 h-8 rounded-full`}
            source={{
              uri: getAvatar(walletIndex || 0),
            }}
          />
          <View style={tw`mx-2`}>
            <Text style={tw`font-bold text-black dark:text-white`}>
              {selectedWallet?.name || `Wallet ${walletIndex + 1}`}{" "}
              {shortenSelectedAddress}
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
        {true && (
          <View
            style={tw`mb-5 rounded-lg bg-red-100 w-full text-center p-1 border-red-700 border`}
          >
            <Text style={tw`text-center`}>
              You need an additional {maxFee} ETH to complete this transaction
            </Text>
          </View>
        )}
        <View style={tw`flex-row justify-between w-full`}>
          <View style={tw`w-1/2 px-2`}>
            <Button variant="outlined" onPress={() => closeModal(false)}>
              Cancel
            </Button>
          </View>
          <View style={tw`w-1/2 px-2`}>
            <Button
              variant="primary"
              loading={isLoading}
              onPress={handleApprove}
            >
              Approve
            </Button>
          </View>
        </View>
      </Actionsheet.Content>
    </Actionsheet>
  );
}

interface IConfirmTransactionHook {
  provider: ethers.providers.BaseProvider;
  wallet: ethers.Wallet;
  reply: (msg: any, origin: string) => void;
}

export default function useConfirmTransactionModal(
  props: IConfirmTransactionHook
) {
  const { reply, wallet, provider } = props;
  const { isOpen, onOpen, onClose } = useDisclose();
  const [id, setId] = useState();
  const [jsonrpcVersion, setJsonrpcVersion] = useState("2.0");
  const [providerName, setProviderName] = useState<string>();
  const [origin, setOrigin] = useState<string>();
  const [transaction, setTransaction] = useState<any>();
  const popupResult = usePopupResult();

  const Modal = useCallback(
    ({
      url,
      closeModal,
      selectedAddress,
      selectedWallet,
      favicon,
      gasPrice,
    }) => {
      return (
        <ConfirmTransactionModal
          url={url}
          favicon={favicon}
          isOpen={isOpen}
          closeModal={closeModal}
          selectedWallet={selectedWallet}
          selectedAddress={selectedAddress}
          transaction={transaction}
          provider={provider}
          gasPrice={gasPrice}
        />
      );
    },
    [isOpen, transaction, provider]
  );

  const openModal = async (request) => {
    const { id: requestId, jsonrpc, params } = request.data;
    const tx = params[0];
    setTransaction(tx);
    setId(requestId);
    setJsonrpcVersion(jsonrpc);
    setProviderName(request.name);
    setOrigin(request.origin);
    onOpen();
  };

  const closeModal = async (approval: boolean) => {
    let result = null;
    let error = null;
    try {
      if (approval) {
        const txRequest = { ...transaction };
        delete txRequest.gas;
        delete txRequest.from;
        const response = await wallet.sendTransaction(txRequest);
        const { hash, wait } = response;
        await wait();
        result = hash;
      } else {
        error = {
          code: 4001,
          message: "User rejected",
        };
      }
      let msg = createResponseMessage(
        providerName,
        id,
        jsonrpcVersion,
        result,
        error
      );
      reply(msg, origin);

      onClose();
    } catch (e) {
      onClose();
      popupResult({
        title:
          e.message ||
          t("domain.error_an_error_occurred_please_try_again_later"),
        isOpen: true,
        type: "error",
      });
      throw e;
    }
  };

  return {
    isOpen,
    openModal,
    Modal,
    closeModal,
  };
}
