import {ethers} from 'ethers';
import {useState, useEffect} from 'react';
import {DEVIVERATION_PATH} from '../configs/bcNetworks';
import {NETWORKS, NETWORK_ENVIRONMENT_ENUM} from '../enum/bcEnum';
import {WalletInterface} from '../data/types';
import {hdkey} from 'ethereumjs-wallet';
import {getNetworkConfig, useBcNetworks} from './useBcNetworks';
/**
 * @dev Create Wallet from Mnemonic
 * @param mnemonic = Mnemonic phraseQ
 * @param index  = Account index
 * @returns wallet
 */

export const createEthereumWallet = (seed: Buffer, accountIndex = 0) => {
  const hdwallet = hdkey.fromMasterSeed(seed);
  const path = DEVIVERATION_PATH[NETWORKS.ETHEREUM](accountIndex);
  const wallet = hdwallet.derivePath(path).getWallet();
  const address = wallet.getAddressString();
  const privateKey = wallet.getPrivateKeyString();
  const publicKey = wallet.getPublicKey().toString('hex');
  return {
    network: NETWORKS.ETHEREUM,
    publicKey: publicKey,
    address: address,
    testnetAddress: address,
    privateKey: privateKey,
  };
};

export const getEthereumBalance = async (
  address: string,
  network: NETWORKS,
  env: NETWORK_ENVIRONMENT_ENUM,
) => {
  const NETWORK_CONFIG = getNetworkConfig(env);
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

const useEvm = (network: NETWORKS, privateKey: string): WalletInterface => {
  const {NETWORK_CONFIG} = useBcNetworks();
  const config = NETWORK_CONFIG[network];
  const [provider, setProvider] = useState<ethers.providers.JsonRpcProvider>();
  const [wallet, setWallet] = useState<ethers.Wallet>();
  const [error, setError] = useState<string>();
  const [address, setAddress] = useState<string>();

  useEffect(() => {
    try {
      if (!privateKey) {
        setError('privateKey is null');
        return;
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
    return '0';
  };

  const transfer = async (receiver: string, amount: string) => {
    try {
      const tx = await wallet.sendTransaction({
        to: receiver,
        value: ethers.utils.parseEther(amount.toString()),
      });
      return tx;
    } catch (e) {
      throw e;
    }
  };

  const getGasPrice = async () => {
    if (provider) {
      return await provider.getGasPrice().toString();
    }
    return '0';
  };

  const estimateGas = async ({
    receiver,
    amount,
  }: {
    receiver: string;
    amount: string;
  }) => {
    if (provider) {
      let gas = await provider.estimateGas({
        to: receiver,
        data: '0xd0e30db0',
        value: ethers.utils.parseEther(amount.toString()),
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

export default useEvm;
