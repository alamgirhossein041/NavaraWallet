import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm/browser';
import { ChainWallet } from './chainWallet';
@Entity('Wallet')
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ length: 256 })
  seedPhrase: string;

  @Column({ type: 'date', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;

  @Column({ nullable: true })
  domain?: string;

  @Column({ nullable: true })
  totalAssets?: number;

  @Column({ default: false })
  isBackedUp: boolean;

  @Column({ type: 'date', default: () => 'CURRENT_TIMESTAMP' })
  lastUsed: string;

  @Column({ nullable: true })
  enabledNetworks?: string;

  @OneToMany(() => ChainWallet, chain => chain.walletId)
  chains: ChainWallet[];
}
