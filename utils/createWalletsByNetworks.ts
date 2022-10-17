import {TOKEN_SYMBOLS} from '../configs/bcNetworks';
import {getSolanaKeypair} from '../hooks/useSolana';
import {getEthereumKeypair} from '../hooks/useEvm';
import {getNearKeypair} from '../hooks/useNEAR';

const createWalletsByNetworks = async (seedPhrase: string) => {
  if (seedPhrase) {
    let ethKeypair = getEthereumKeypair(seedPhrase);
    let solanaKeypair = getSolanaKeypair(seedPhrase);
    let nearKeypair = getNearKeypair(seedPhrase);

    const result = await Promise.all([ethKeypair, solanaKeypair, nearKeypair]);
    const walletsByNetwork = result.map(keyPair => {
      return {
        address: keyPair.address,
        privateKey: keyPair.privateKey,
        publicKey: keyPair.publicKey,
        symbol: TOKEN_SYMBOLS[keyPair.network],
        network: keyPair.network,
      };
    });
    return walletsByNetwork;
  }
};

export default createWalletsByNetworks;
