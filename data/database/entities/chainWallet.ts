import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm/browser';
import {Wallet} from './wallet';
@Entity('ChainWallet')
export class ChainWallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(type => Wallet, wallet => wallet.id)
  walletId: string;

  @Column()
  network: string;

  @Column()
  address: string;

  @Column()
  privateKey?: string;

  @Column()
  publicKey: string;

  @Column()
  symbol: string;

  @Column({nullable: true, default: 0})
  balance?: number;
}
