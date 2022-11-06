import { BN } from "bn.js";
import { Actionsheet, useDisclose } from "native-base";
import * as nearAPI from "near-api-js";
import queryString from "query-string";
import React, { useCallback, useState } from "react";
import { Image, Text, View } from "react-native";
import { CheckCircleIcon, LockClosedIcon } from "react-native-heroicons/solid";
import IconNear from "../../assets/icons/icon-near.svg";
import Button from "../../components/UI/Button";
import { Wallet } from "../../data/database/entities/wallet";
import { NETWORKS } from "../../enum/bcEnum";
import { useWalletSelected } from "../../hooks/useWalletSelected";
import getAvatar from "../../utils/getAvatar";
import getDomainFromUrl from "../../utils/getDomainFromUrl";
import { shortenAddress } from "../../utils/stringsFunction";
import { tw } from "../../utils/tailwind";
import Favicon from "./Favicon";

interface INearSSOModalProps {
  favicon: string;
  url: string;
  isOpen: boolean;
  closeModal: (approval) => void;
  connectable: boolean;
}

export function NearSSOModal(props: INearSSOModalProps) {
  const { favicon, url, isOpen, closeModal, connectable } = props;

  const { data: selectedWallet, index: walletIndex } = useWalletSelected();

  const getNearAddress = useCallback(
    (selectedWallet: Wallet) => {
      const node = selectedWallet.chains.find(
        (chain) => chain.network === NETWORKS.NEAR
      );

      return node?.address || null;
    },
    [selectedWallet]
  );

  const handleCloseModal = (approval) => {
    if (approval && !connectable) return;
    closeModal(approval);
  };

  const nearAddress = getNearAddress(selectedWallet);
  const shortenSelectedAddress = shortenAddress(nearAddress);
  return (
    <Actionsheet isOpen={isOpen} onClose={() => handleCloseModal(false)}>
      <Actionsheet.Content style={tw`bg-white dark:bg-[#18191A]`}>
        <View style={tw`flex-row items-center mb-3`}>
          <LockClosedIcon color="gray" size={15} />
          <Text style={tw`text-black dark:text-white`}>
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
            <Text style={tw`mx-1 font-bold`} numberOfLines={1}>
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

interface INearSSOModal {
  near: nearAPI.Near;
  accountId: string;
  nearAccountPublicKey: string;
  redirect: (url: string) => void;
}

const ACCESS_KEY_FUNDING_AMOUNT = new BN("250000000000000000000000");

export default function useNearSSOMOdal(props: INearSSOModal) {
  const { isOpen, onOpen, onClose } = useDisclose();
  const { near, accountId, nearAccountPublicKey, redirect } = props;
  const [contractId, setContractId] = useState<string>();
  const [publicKey, setPublicKey] = useState<string>();
  const [successUrl, setSuccessUrl] = useState<string>();
  const [failureUrl, setFailureUrl] = useState<string>();

  const Modal = useCallback(
    ({ favicon, url, closeModal, connectable }) => {
      return (
        <NearSSOModal
          favicon={favicon}
          url={url}
          isOpen={isOpen}
          closeModal={closeModal}
          connectable={connectable}
        />
      );
    },
    [isOpen]
  );

  const openModal = (url: string) => {
    const urlObj = new URL(url);
    const params = queryString.parse(urlObj.search);

    setContractId(params.contract_id.toString());
    setSuccessUrl(params.success_url.toString());
    setFailureUrl(params.failure_url.toString());
    setPublicKey(params.public_key.toString());
    onOpen();
  };

  const closeModal = async (approval: boolean) => {
    if (approval) {
      try {
        const account = await near.account(accountId);
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
      } catch (e) {}
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
