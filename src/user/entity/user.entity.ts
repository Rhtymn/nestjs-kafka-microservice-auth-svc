import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: '50' })
  email: string;

  @Column({ type: 'varchar', length: '30' })
  username: string;

  @Column({ type: 'varchar' })
  password: string;
}
