import { Actionsheet, useDisclose } from "native-base";
import React, { useCallback, useState } from "react";
import { Image, Text, View } from "react-native";
import { LockClosedIcon } from "react-native-heroicons/solid";
import Button from "../../components/UI/Button";
import { useBrowserActions } from "../../data/globalState/browser/browser.actions";
import { useWalletSelected } from "../../hooks/useWalletSelected";
import getAvatar from "../../utils/getAvatar";
import getDomainFromUrl from "../../utils/getDomainFromUrl";
import { shortenAddress } from "../../utils/stringsFunction";
import { tw } from "../../utils/tailwind";
import { createResponseMessage } from "../../utils/web3Message";
import Favicon from "./Favicon";

interface IConnectWalletProps {
  url: string;
  isOpen: boolean;
  onClose: (approval: boolean, callback?: Function) => void;
  selectedAddress: string;
  selectedWallet: any;
  favicon: string;
}

export function ApproveAccessModal(props: IConnectWalletProps) {
  const { url, isOpen, onClose, selectedAddress, favicon } = props;
  const ethAddress = shortenAddress(selectedAddress);
  const { data: selectedWallet, index: walletIndex } = useWalletSelected();
  return (
    <Actionsheet isOpen={isOpen} onClose={() => onClose(false)}>
      <Actionsheet.Content style={tw`bg-white dark:bg-[#18191A]`}>
        <Favicon url={favicon} />
        <View style={tw`flex-row items-center mb-3`}>
          <LockClosedIcon color="gray" size={15} />
          <Text style={tw`text-black dark:text-white`}>
            {getDomainFromUrl(url)}
          </Text>
        </View>
        <Text style={tw`mb-5 text-xl font-bold text-black dark:text-white`}>
          Connect to this site
        </Text>

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
              {selectedWallet?.name || `Wallet ${walletIndex + 1}`} (
              {ethAddress})
            </Text>
          </View>
        </View>
        <View style={tw`flex-row justify-between w-full`}>
          <View style={tw`w-1/2 px-2`}>
            <Button variant="outlined" onPress={() => onClose(false)}>
              Cancel
            </Button>
          </View>
          <View style={tw`w-1/2 px-2`}>
            <Button variant="primary" onPress={() => onClose(true)}>
              Connect
            </Button>
          </View>
        </View>
      </Actionsheet.Content>
    </Actionsheet>
  );
}

interface IGrantAccessWeb3Hook {
  reply: (msg: any, origin: string) => void;
  selectedAddress: string;
}

export default function useApproveAccessModal(props: IGrantAccessWeb3Hook) {
  const { addApprovedHost } = useBrowserActions();
  const { reply, selectedAddress } = props;
  const { isOpen, onOpen, onClose } = useDisclose();
  const [id, setId] = useState();
  const [jsonrpcVersion, setJsonrpcVersion] = useState("2.0");
  const [providerName, setProviderName] = useState<string>();
  const [origin, setOrigin] = useState<string>();

  const openModal = (request: any) => {
    const {
      data: { id: requestId, jsonrpc },
      name,
      origin,
    } = request;
    setId(requestId);
    setJsonrpcVersion(jsonrpc);
    setProviderName(name);
    setOrigin(origin);
    onOpen();
  };

  const closeModal = (approval: boolean) => {
    let result;
    let error = null;
    if (!approval) {
      error = {
        code: 4001,
        message: "User rejected",
      };
    } else {
      result = [selectedAddress];
      const hostname = new URL(origin).hostname;
      addApprovedHost(hostname);
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
  };

  const Modal = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    ({ url, closeModal, setApprovedHosts, selectedWallet, favicon }) => {
      return (
        <ApproveAccessModal
          url={url}
          isOpen={isOpen}
          onClose={closeModal}
          selectedAddress={selectedAddress}
          setApprovedHosts={setApprovedHosts}
          selectedWallet={selectedWallet}
          favicon={favicon}
        />
      );
    },
    [isOpen, selectedAddress]
  );

  return {
    isOpen,
    openModal,
    closeModal,
    Modal,
  };
}
