import { getRepository } from "typeorm/browser";
import { FungibleTokens } from "../entities/fungibleTokens";

export default class FungibleTokensController {
  private fungibleTokenRepository;
  constructor() {
    this.fungibleTokenRepository = getRepository(FungibleTokens);
  }

  public async createFungibleToken(data): Promise<FungibleTokens> {
    return this.fungibleTokenRepository.save(data);
  }

  public async deleteFungibleToken(id: string): Promise<any> {
    return this.fungibleTokenRepository.delete({ id });
  }
}
