import { ethers, Wallet } from "ethers";
import { useState, useEffect, FC } from "react";
import { EVM_CHAINS, NETWORK_CONFIG } from "../configs/bcNetworks";
import { RpcProviderMethod, NETWORKS } from "../enum/bcEnum";
import { WalletInterface, WalletProps } from "../data/types";
import { parseEther } from "ethers/lib/utils";
import * as Bip39 from 'bip39';
import { hdkey } from 'ethereumjs-wallet';

/**
 * @dev Create Wallet from Mnemonic
 * @param mnemonic = Mnemonic phrase
 * @param index  = Account index
 * @returns wallet
 */
export const createWallet = async (mnemonic: string, index: number): Promise<Wallet> => {
  const seed = await Bip39.mnemonicToSeed(mnemonic);
  const hdNode = hdkey.fromMasterSeed(seed);
  const node = hdNode.derivePath(`m/44'/60'/0'`)
  // m/44'/60'/0'/0
  const change = node.deriveChild(0);
  // m/44'/60'/0'/0/{N}
  const childNode = change.deriveChild(index);
  const childWallet = childNode.getWallet();
  const wallet = new Wallet(childWallet.getPrivateKey().toString('hex'));
  return wallet
}

export const getEthereumAddressByPrivateKey = (privateKey: string): string => {
  let wallet = new ethers.Wallet(privateKey);
  return wallet.publicKey
}

export const getEthereumAddress = async (mnemonic: string): Promise<string> => {
  let wallet = await getEthereumKeypair(mnemonic);
  return wallet.address;
};

export const getEthereumKeypair = async (mnemonic: string): Promise<ethers.Wallet> => {
  // let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);
  // return mnemonicWallet;
  let wallet = await createWallet(mnemonic, 0);
  return wallet
};

export const getEthereumBalance = async (
  address: string,
  network: NETWORKS
) => {
  const config = NETWORK_CONFIG[network];
  let provider = new ethers.providers.JsonRpcProvider(config.rpc);
  if (provider) {
    const balance = await provider.getBalance(address);
    const balanceInEth = ethers.utils.formatEther(balance);
    return {
      address,
      balance: balanceInEth,
      network,
    };
  }
};

const useEvm = ({
    network,
    privateKey
}: WalletProps): WalletInterface => {
    const config = NETWORK_CONFIG[network];
    const [provider, setProvider] = useState<ethers.providers.JsonRpcProvider>()
    const [wallet, setWallet] = useState<ethers.Wallet>()
    const [error, setError] = useState<string>()
    const [address, setAddress] = useState<string>()

  useEffect(() => {
    try {
      if (!privateKey) {
        setError("privateKey is null")
        return
      }
      let walletPrivateKey = privateKey;
      let provider = new ethers.providers.JsonRpcProvider(config.rpc);
      setProvider(provider);
      
      const wallet = new ethers.Wallet(walletPrivateKey, provider);
      setWallet(wallet);
      setAddress(wallet.address);
    } catch (e) {
      setError(e.message);
    }
  }, [network]);

  const getBalanceOf = async (publicKey: string) => {
    if (provider) {
      const balance = await provider.getBalance(publicKey);
      const balanceInEth = ethers.utils.formatEther(balance);
      return balanceInEth;
    }
    return "0";
  };

  const transfer = async (receiver: string, amount: string) => {
    try {
      const tx = await wallet.sendTransaction({
        to: receiver,
        value: ethers.utils.parseEther(amount.toString()),
      });
      return tx;
    } catch (e) {
      console.log(e)
      throw e
    }
    
  };

  const getGasPrice = async () => {
    if (provider) {
      return await provider.getGasPrice().toString();
    }
    return "0"
  };

  const estimateGas = async ({receiver, amount}: {receiver: string, amount: string}) => {
    if (provider) {
      let gas = await provider.estimateGas({
        to: receiver,
        data: "0xd0e30db0",
        value: parseEther(amount.toString()),
      });

      return ethers.utils.formatEther(gas);
    }
  };

  const getWallet = () => {
    return wallet;
  };

  return {
    provider,
    address,
    error,
    getBalanceOf,
    transfer,
    // getGasPrice,
    estimateGas,
    getWallet,
  };
};

export default useEvm