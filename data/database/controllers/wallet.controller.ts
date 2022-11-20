import CryptoJS from "crypto-js";
import { createQueryBuilder, getRepository } from "typeorm/browser";
import { Config, names, uniqueNamesGenerator } from "unique-names-generator";
import {
  decryptAESWithKeychain,
  getFromKeychain,
} from "../../../core/keychain";
import { localStorage, WALLETS_ORDER } from "../../../utils/storage";
import { ChainWallet } from "../entities/chainWallet";
import { Wallet } from "../entities/wallet";
const config: Config = {
  dictionaries: [names],
};

export default class WalletController {
  private walletRepository;
  private chainWalletRepository;

  constructor() {
    this.walletRepository = getRepository(Wallet);
    this.chainWalletRepository = getRepository(ChainWallet);
  }

  public async createWallet(seedPhrase: string): Promise<Wallet> {
    const newWallet = new Wallet();
    const password = await getFromKeychain();
    const encryptedSeedPhrase = CryptoJS.AES.encrypt(
      seedPhrase,
      password
    ).toString();

    newWallet.seedPhrase = password ? encryptedSeedPhrase : seedPhrase;
    newWallet.name = `Wallet ${uniqueNamesGenerator(config)}`;
    return this.walletRepository.save(newWallet);
  }

  public async updateWallet(wallet: Wallet): Promise<any> {
    return this.walletRepository.save(wallet);
  }

  public async updateWalletSpecific(
    walletId: string,
    newValue: {}
  ): Promise<any> {
    const wallet = await this.walletRepository.findOne({ id: walletId });
    return this.walletRepository.save({ ...wallet, ...newValue });
  }

  public async removeWallet(id: string): Promise<any> {
    await this.chainWalletRepository.delete({ walletId: id });
    return this.walletRepository.delete(id);
  }

  public async getWallets(): Promise<Wallet[]> {
    const listWallets = await this.walletRepository
      .createQueryBuilder("wallet")
      .leftJoinAndSelect("wallet.chains", "chainWallet")
      .leftJoinAndSelect("wallet.fungibleTokens", "fungibleToken")
      .getMany();

    const walletsOrder = (await localStorage.get(WALLETS_ORDER)) as string[];

    if (walletsOrder?.length > 0 && listWallets?.length > 0) {
      try {
        const sortedListWallets = listWallets.sort((a, b) => {
          const indexA = walletsOrder.indexOf(a?.id) || 0;
          const indexB = walletsOrder.indexOf(b?.id) || 0;
          return indexA - indexB;
        });

        return sortedListWallets;
      } catch (error) {}
    }
    return listWallets;
  }

  public async getSeedPhrase(walletId: string): Promise<string> {
    const wallet: any = await createQueryBuilder("Wallet")
      .select(["Wallet.seedPhrase"])
      .where("Wallet.id = :walletId", { walletId })
      .getOne();

    if (wallet.seedPhrase) {
      const decryptedSeedPhrase = await decryptAESWithKeychain(
        wallet.seedPhrase
      );

      return decryptedSeedPhrase;
    }
  }
}
