import { Actionsheet, useDisclose } from "native-base";
import * as nearAPI from "near-api-js";
import queryString from "query-string";
import React, { useCallback, useState } from "react";
import { Text, View } from "react-native";
import { GlobeAltIcon } from "react-native-heroicons/solid";
import { useRecoilValue } from "recoil";
import Button from "../../components/UI/Button";
import { NEAR_MAINNET_CONFIG } from "../../configs/bcMainnets";
import { NETWORK_COINGEKO_IDS } from "../../configs/bcNetworks";
import { NEAR_TESTNET_CONFIG } from "../../configs/bcTestnets";
import { primaryColor } from "../../configs/theme";
import { CURRENCIES } from "../../constants/currencies";
import API, { URL_GET_PRICE } from "../../data/api";
import { listWalletsState } from "../../data/globalState/listWallets";
import { NETWORKS } from "../../enum/bcEnum";
import { createNearInstance } from "../../hooks/useNEAR";
import { parseTransactionsToSign } from "../../utils/nearTransaction";
import { formatBalance } from "../../utils/number";
import { shortenAddress } from "../../utils/stringsFunction";
import { tw } from "../../utils/tailwind";

export function ApproveNearTransactionModal(props) {
  const { closeModal, isOpen, sign, balance, price } = props;
  const {
    callbackUrl,
    totalAmount,
    signerId,
    fees: { gasLimit },
  } = sign;

  const url = new URL(callbackUrl);

  const formatedTotalAmount =
    nearAPI.utils.format.formatNearAmount(totalAmount);

  const gasLimitFloat = parseFloat(
    nearAPI.utils.format.formatNearAmount(gasLimit)
  );
  const maxFeeUsd =
    gasLimitFloat * price > 0.01
      ? formatBalance((gasLimitFloat * price).toString())
      : "< 0.0001";
  const maxFee = gasLimitFloat > 0.00001 ? gasLimitFloat : "< 0.00001";
  return (
    <Actionsheet isOpen={isOpen} onClose={() => closeModal(false)}>
      <Actionsheet.Content style={tw`bg-white dark:bg-[#18191A]`}>
        <Text style={tw`mb-3 text-lg font-bold text-black dark:text-white`}>
          Approve Trasaction
        </Text>
        <View
          style={tw`flex-row items-center p-2 mb-5 bg-blue-100 border border-blue-200 rounded-full`}
        >
          <GlobeAltIcon color={primaryColor} />
          <Text style={tw`text-[${primaryColor}]`}>{url.hostname}</Text>
        </View>
        <View>
          <Text style={tw`text-2xl font-bold text-black dark:text-white`}>
            {formatedTotalAmount} NEAR
          </Text>
          <Text style={tw`mb-5 text-center text-gray-500`}>
            $
            {formatBalance(
              (parseFloat(formatedTotalAmount) * price).toString()
            )}
          </Text>
        </View>
        <View
          style={tw`flex-row items-center justify-between w-full px-3 py-5 border-t border-b border-gray-200`}
        >
          <Text style={tw`text-gray-500`}>From</Text>
          <View>
            <Text style={tw`font-bold text-right text-black dark:text-white`}>
              {shortenAddress(signerId)}
            </Text>
            <Text style={tw`font-bold text-right gray`}>
              {formatBalance(balance || "0")} NEAR
            </Text>
          </View>
        </View>
        <View
          style={tw`flex-row items-center justify-between w-full px-3 py-5 mb-5 border-t border-b border-gray-200`}
        >
          <Text style={tw`text-gray-500`}>Max fees</Text>
          <View>
            <Text style={tw`font-bold text-right text-black dark:text-white`}>
              {maxFee} NEAR
            </Text>
            <Text style={tw`font-bold text-right gray`}>{maxFeeUsd} USD</Text>
          </View>
        </View>
        <View style={tw`flex-row justify-between w-full`}>
          <View style={tw`w-1/2 px-2`}>
            <Button variant="outlined" onPress={() => closeModal(false)}>
              Cancel
            </Button>
          </View>
          <View style={tw`w-1/2 px-2`}>
            <Button variant="primary" onPress={() => closeModal(true)}>
              Approval
            </Button>
          </View>
        </View>
      </Actionsheet.Content>
    </Actionsheet>
  );
}

interface INearApproveAccessModal {
  redirect: (url: string) => void;
}

export default function useNearApproveAccessModal(
  props: INearApproveAccessModal
) {
  const { redirect } = props;
  const { isOpen, onOpen, onClose } = useDisclose();
  const [sign, setSign] = useState<any>({
    callbackUrl: "https://navara.nns,one",
    totalAmount: "0",
    signerId: "",
    fees: { gasLimit: "0" },
  });
  const [balance, setBalance] = useState<string>();
  const [nearPrice, setNearPrice] = useState<number>();
  const [account, setAccount] = useState<nearAPI.Account>();
  const [accountId, setAccountId] = useState<string>();
  const [networkId, setNetworkId] = useState<string>();

  const listWallets = useRecoilValue(listWalletsState);

  const nearWallets = listWallets.map((wallet) => {
    const { chains } = wallet;
    const nearWallet = chains.find((chain) => chain.network === NETWORKS.NEAR);
    return nearWallet;
  });

  const openModal = async (url: URL, network: string) => {
    const { callbackUrl, transactions } = queryString.parse(url.search);
    const sign = parseTransactionsToSign(transactions, callbackUrl);
    const signerId = sign.transactions[0]?.signerId;
    setSign({ ...sign, signerId });
    await initState(signerId, network);
    onOpen();
  };

  const initState = async (signerId, network) => {
    const config =
      network === NEAR_MAINNET_CONFIG.networkId
        ? NEAR_MAINNET_CONFIG
        : NEAR_TESTNET_CONFIG;
    const nearWallet = nearWallets.find((wallet) => {
      const addressByNetwrok =
        network === NEAR_MAINNET_CONFIG.networkId
          ? wallet.address
          : wallet.testnetAddress;
      return addressByNetwrok === signerId;
    });
    if (nearWallet) {
      try {
        const { near, accountId } = await createNearInstance(
          nearWallet.privateKey,
          config
        );
        const account = await near.account(accountId);

        const state = await account.state();
        let accountBalance;
        if (state) {
          const totalBalance = await account.getAccountBalance();
          const availableBalance = nearAPI.utils.format.formatNearAmount(
            totalBalance.available || "0"
          );
          accountBalance = availableBalance;
        } else {
          accountBalance = "0";
        }

        const ids = NETWORK_COINGEKO_IDS[NETWORKS.NEAR];
        const prices = await API.get(URL_GET_PRICE, {
          params: {
            ids,
            vs_currencies: CURRENCIES.USD,
          },
        });
        const nearPrice =
          prices[NETWORK_COINGEKO_IDS[NETWORKS.NEAR]][CURRENCIES.USD];
        setNearPrice(nearPrice);
        setBalance(accountBalance);
        setAccount(account);
        setAccountId(accountId);
        setNetworkId(network);
      } catch (e) {}
    }
  };

  /**
   * Called when user close modal or approve transaction, if transaction successed, redirect to success url with params is tx hash
   * @param approval if transaction is approved by user or not
   * @returns
   */
  const closeModal = async (approval: boolean) => {
    if (approval) {
      const { transactions } = sign;
      const transactionHashes = [];
      for (let { receiverId, nonce, blockHash, actions } of transactions) {
        let status, transaction;
        // TODO: Decide whether we always want to be recreating transaction (vs only if it's invalid)
        // See https://github.com/near/near-wallet/issues/1856
        const recreateTransaction = account.deployMultisig || true;
        if (recreateTransaction) {
          try {
            ({ status, transaction } = await account.signAndSendTransaction({
              receiverId,
              actions,
            }));
          } catch (error) {
            if (error.message.includes("Exceeded the prepaid gas")) {
            }

            throw error;
          }
        } else {
          // TODO: Maybe also only take receiverId and actions as with multisig path?
          const [, signedTransaction] =
            await nearAPI.transactions.signTransaction(
              receiverId,
              nonce,
              actions,
              blockHash,
              this.connection.signer,
              accountId,
              networkId
            );
          ({ status, transaction } =
            await this.connection.provider.sendTransaction(signedTransaction));
        }

        // TODO: Shouldn't throw more specific errors on failure?
        if (status.Failure !== undefined) {
          throw new Error(
            `Transaction failure for transaction hash: ${transaction.hash}, receiver_id: ${transaction.receiver_id} .`
          );
        }
        transactionHashes.push({
          hash: transaction.hash,
          nonceString: nonce.toString(),
        });
        // TODO: Shouldn't throw more specific errors on failure?
        const parsedUrl = new URL(sign.callbackUrl);
        parsedUrl.searchParams.set(
          "transactionHashes",
          transactionHashes.join(",")
        );
        redirect(parsedUrl.href);
      }
    }
    onClose();
  };

  const Modal = useCallback(
    ({ closeModal }) => {
      return (
        <ApproveNearTransactionModal
          isOpen={isOpen}
          closeModal={closeModal}
          sign={sign}
          balance={balance}
          price={nearPrice}
          accountId={"accountId"}
        />
      );
    },
    [isOpen, sign, balance, nearPrice]
  );

  return {
    isOpen,
    openModal,
    closeModal,
    Modal,
  };
}
