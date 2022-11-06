import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm/browser';
@Entity('BrowserFavorites')
export class BrowserFavorites {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({unique: true})
  url: string;
  @Column({nullable: true})
  icon: string;
  @Column()
  title: string;
  @Column({type: 'date', default: () => 'CURRENT_TIMESTAMP'})
  createdAt: string;
}
