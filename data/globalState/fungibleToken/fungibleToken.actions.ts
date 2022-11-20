import { cloneDeep } from "lodash";
import { useRecoilState } from "recoil";
import FungibleTokensController from "../../database/controllers/fungibleTokens.controller";
import { FungibleTokens } from "../../database/entities/fungibleTokens";
import { ITokenMetadata } from "../../types";
import { listWalletsState } from "../listWallets";

const useFungibleTokenActions = () => {
  const fungibleTokensController = new FungibleTokensController();
  const [wallets, setWallets] = useRecoilState(listWalletsState);

  const actions = {
    get: (walletId: string): FungibleTokens[] => {
      return wallets.find((wallet) => wallet.id === walletId)?.fungibleTokens;
    },

    create: async (
      walletId: string,
      metadata: ITokenMetadata
    ): Promise<FungibleTokens> => {
      const fungibleToken = await fungibleTokensController.createFungibleToken({
        ...metadata,
        walletId,
      });

      setWallets((oldWallets) => {
        const wallet = oldWallets.find((_wallet) => _wallet.id === walletId);
        if (wallet) {
          wallet.fungibleTokens = [...wallet.fungibleTokens, fungibleToken];
        }
        return oldWallets;
      });

      return fungibleToken;
    },

    remove: async (
      walletId: string,
      tokenId: string
    ): Promise<FungibleTokens[]> => {
      await fungibleTokensController.deleteFungibleToken(tokenId);
      const newWallets = cloneDeep(wallets);

      const wallet = newWallets.find((_wallet) => _wallet.id === walletId);
      if (wallet) {
        wallet.fungibleTokens = wallet.fungibleTokens.filter(
          (token) => token.id !== tokenId
        );
      }

      setWallets(newWallets);

      return wallet.fungibleTokens;
    },
  };
  return actions;
};

export default useFungibleTokenActions;
