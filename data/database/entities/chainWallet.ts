import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm/browser";
import { Wallet } from "./wallet";
@Entity("ChainWallet")
export class ChainWallet {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne((type) => Wallet, (wallet) => wallet.id)
  walletId: string;

  @Column()
  network: string;

  @Column()
  address: string;

  @Column()
  testnetAddress: string;

  @Column()
  privateKey?: string;

  @Column()
  publicKey: string;

  @Column()
  symbol: string;

  @Column({ nullable: true, default: 0 })
  balance?: number;

  @Column({ nullable: true })
  currentAddress?: string;
}
