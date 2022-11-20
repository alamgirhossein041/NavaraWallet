import CryptoJS from "crypto-js";
import { createQueryBuilder, getRepository } from "typeorm/browser";
import {
  decryptAESWithKeychain,
  getFromKeychain,
} from "../../../core/keychain";
import { NETWORKS } from "../../../enum/bcEnum";
import { ChainWallet } from "../entities/chainWallet";

export default class ChainWalletController {
  private chainWalletRepository;

  constructor() {
    this.chainWalletRepository = getRepository(ChainWallet);
  }

  public async createChainWallet(
    chainWallet: ChainWallet
  ): Promise<ChainWallet> {
    const password = await getFromKeychain();
    const privateKey = chainWallet.privateKey;
    const encryptedSeedPhrase = CryptoJS.AES.encrypt(
      privateKey,
      password
    ).toString();

    chainWallet.privateKey = password ? encryptedSeedPhrase : privateKey;
    return this.chainWalletRepository.save(chainWallet);
  }

  public async getPrivateKey(
    walletId: string,
    network: string = NETWORKS.ETHEREUM
  ): Promise<string> {
    try {
      const chain: any = await createQueryBuilder("ChainWallet")
        .select(["ChainWallet.privateKey"])
        .where(
          "ChainWallet.walletId = :walletId AND ChainWallet.network = :network",
          { walletId, network }
        )
        .getOne();
      const decryptedPrivateKey = await decryptAESWithKeychain(
        chain.privateKey
      );

      return decryptedPrivateKey;
    } catch (error) {
      console.warn("error", error);
    }
  }
}
