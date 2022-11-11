import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm/browser";
import { ChainWallet } from "./chainWallet";
@Entity("Wallet")
export class Wallet {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ length: 256 })
  seedPhrase: string;

  @Column({ type: "date", default: () => "CURRENT_TIMESTAMP" })
  createdAt: string;

  @Column({ nullable: true })
  domain?: string;

  @Column({ nullable: true })
  totalAssets?: number;

  @Column({ default: false })
  isBackedUp: boolean;

  @Column({ nullable: true })
  enabledNetworks?: string;

  @OneToMany(() => ChainWallet, (chain) => chain.walletId)
  chains: ChainWallet[];
}
