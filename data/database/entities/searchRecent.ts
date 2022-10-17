import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm/browser';
@Entity('SearchRecent')
export class SearchRecent {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({unique: true})
  keyword: string;
  @Column({type: 'date', default: () => 'CURRENT_TIMESTAMP'})
  createdAt: string;
}
