import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm/browser';
@Entity('BrowserHistory')
export class BrowserHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  url: string;
  @Column()
  title: string;
  @Column({type: 'date', default: () => 'CURRENT_TIMESTAMP'})
  createdAt: string;
}
