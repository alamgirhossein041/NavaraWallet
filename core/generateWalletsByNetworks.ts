import { TOKEN_SYMBOLS } from "../configs/bcNetworks";
import { createEthereumWallet } from "../hooks/useEvm";
import { createNearWallet } from "../hooks/useNEAR";
import { createSolanaWallet } from "../hooks/useSolana";

/**
 * Generating address for wallet
 * @param seed
 * @param isCreateNewWallet boolean
 * @returns
 */
const generateWalletsByNetworks = async (seed, isCreateNewWallet) => {
  if (seed) {
    const result = await Promise.all([
      createNearWallet(seed, isCreateNewWallet),
      createEthereumWallet(seed),
      createSolanaWallet(seed),
    ]);
    const walletsByNetwork = result.map((keyPair) => {
      return {
        ...keyPair,
        symbol: TOKEN_SYMBOLS[keyPair.network],
      };
    });
    return walletsByNetwork;
  }
};

export default generateWalletsByNetworks;
