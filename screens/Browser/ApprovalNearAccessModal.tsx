import { BN } from "bn.js";
import { Actionsheet, useDisclose } from "native-base";
import * as nearAPI from "near-api-js";
import queryString from "query-string";
import React, { useCallback, useState } from "react";
import { Alert, Image, Text, View } from "react-native";
import { CheckCircleIcon, LockClosedIcon } from "react-native-heroicons/solid";
import { useRecoilValue } from "recoil";
import IconNear from "../../assets/icons/icon-near.svg";
import Button from "../../components/UI/Button";
import { nearInstanceState } from "../../data/globalState/nearInstance";
import { useWalletSelected } from "../../hooks/useWalletSelected";
import getAvatar from "../../utils/getAvatar";
import getDomainFromUrl from "../../utils/getDomainFromUrl";
import { shortenAddress } from "../../utils/stringsFunction";
import { tw } from "../../utils/tailwind";
import Favicon from "./Favicon";

interface IApprovalNearAccessModalProps {
  favicon: string;
  url: string;
  isOpen: boolean;
  closeModal: (approval) => void;
  accountId: string;
}

export function ApprovalNearAccessModal(props: IApprovalNearAccessModalProps) {
  const { favicon, url, isOpen, closeModal, accountId } = props;

  const { data: selectedWallet, index: walletIndex } = useWalletSelected();

  const handleCloseModal = (approval) => {
    closeModal(approval);
  };

  const shortenSelectedAddress = shortenAddress(accountId);
  return (
    <Actionsheet isOpen={isOpen} onClose={() => handleCloseModal(false)}>
      <Actionsheet.Content style={tw`bg-white dark:bg-[#18191A]`}>
        <View style={tw`flex-row items-center mb-3`}>
          <LockClosedIcon color="gray" size={15} />
          <Text style={tw`mx-1 text-black dark:text-white`}>
            {getDomainFromUrl(url)}
          </Text>
        </View>
        <View style={tw`flex-row items-center justify-between w-full mb-5`}>
          <Favicon url={favicon} size={11} />

          {[...Array(7)].map((item, index) =>
            index === 3 ? (
              <View>
                <CheckCircleIcon color="green" width={40} height={40} />
              </View>
            ) : (
              <View style={tw`w-2 h-2 bg-green-600 rounded-full`}></View>
            )
          )}

          <View>
            <IconNear width={50} height={50} />
          </View>
        </View>
        <Text style={tw`mb-5 text-lg font-bold text-black dark:text-white`}>
          Connect to NEAR wallet
        </Text>
        <View
          style={tw`flex-row items-center justify-between w-full p-3 mb-3 border border-gray-300 rounded-lg`}
        >
          <View style={tw`flex-row items-center`}>
            <Image
              style={tw`w-8 h-8 rounded-full`}
              source={{
                uri: getAvatar(walletIndex || 0),
              }}
            />
            <Text
              style={tw`mx-1 font-bold text-black dark:text-white`}
              numberOfLines={1}
            >
              {selectedWallet?.name || `Wallet ${walletIndex + 1}`}{" "}
            </Text>
          </View>
          <Text style={tw`text-black dark:text-white`}>
            {shortenSelectedAddress}
          </Text>
        </View>
        <View style={tw`flex-row justify-between w-full`}>
          <View style={tw`w-1/2 px-2`}>
            <Button variant="outlined" onPress={() => handleCloseModal(false)}>
              Cancel
            </Button>
          </View>
          <View style={tw`w-1/2 px-2`}>
            <Button variant="primary" onPress={() => handleCloseModal(true)}>
              Connect
            </Button>
          </View>
        </View>
      </Actionsheet.Content>
    </Actionsheet>
  );
}

interface IApprovalNearAccessModal {
  redirect: (url: string) => void;
}

const ACCESS_KEY_FUNDING_AMOUNT = new BN("250000000000000000000000");

export default function useApprovalNearAccessModal(
  props: IApprovalNearAccessModal
) {
  const { isOpen, onOpen, onClose } = useDisclose();
  const { redirect } = props;
  const [contractId, setContractId] = useState<string>();
  const [publicKey, setPublicKey] = useState<string>();
  const [successUrl, setSuccessUrl] = useState<string>();
  const [nearInstance, setNearInstance] = useState<nearAPI.Near>();
  const [accountId, setAccountId] = useState<string>();
  const [nearAccountPublicKey, setNearAccountPublicKey] = useState<string>();

  const instance = useRecoilValue(nearInstanceState);

  const Modal = useCallback(
    ({ favicon, url, closeModal }) => {
      return (
        <ApprovalNearAccessModal
          favicon={favicon}
          url={url}
          isOpen={isOpen}
          closeModal={closeModal}
          accountId={accountId}
        />
      );
    },
    [isOpen, accountId]
  );

  const openModal = async (url: URL, networkId: string) => {
    const { near, accountId, publicKey } = instance[networkId];
    setNearInstance(near);
    setAccountId(accountId);
    const params = queryString.parse(url.search);
    setContractId(params.contract_id.toString());
    setSuccessUrl(params.success_url.toString());
    setPublicKey(params.public_key.toString());
    setNearAccountPublicKey(publicKey);
    onOpen();
  };

  const closeModal = async (approval: boolean) => {
    if (approval) {
      try {
        const account = await nearInstance.account(accountId);
        await account.addKey(
          publicKey,
          contractId,
          [],
          ACCESS_KEY_FUNDING_AMOUNT
        );
        const availableKeys = [nearAccountPublicKey];
        const parsedUrl = new URL(successUrl);
        parsedUrl.searchParams.set("account_id", accountId);
        if (publicKey) {
          parsedUrl.searchParams.set("public_key", publicKey);
        }
        parsedUrl.searchParams.set("all_keys", availableKeys.join(","));
        redirect(parsedUrl.href);
      } catch (e) {
        Alert.alert(e.message);
      }
    }
    onClose();
  };

  return {
    Modal,
    openModal,
    closeModal,
    isOpen,
  };
}
