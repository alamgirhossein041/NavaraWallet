import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm/browser";
import { Wallet } from "./wallet";

@Entity("FungibleTokens")
export class FungibleTokens {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne((type) => Wallet, (wallet) => wallet.id)
  walletId: string;

  @Column({ nullable: true })
  network: string;

  @Column({ nullable: true })
  contractAddress: string;

  @Column({ nullable: true })
  decimals: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  symbol: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true, default: 0 })
  tokenBalance?: number;
}
