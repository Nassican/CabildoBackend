import { Role } from 'src/roles/entities/role.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('usuarios_credenciales')
export class User {
  @PrimaryGeneratedColumn()
  id_usuario: number;

  @Column({ unique: true, nullable: false })
  num_documento: string;

  @Column()
  nombres: string;

  @Column()
  apellidos: string;

  @Column({ nullable: false, select: false })
  password: string;

  @Column({ nullable: true, select: false })
  huella_digital: BinaryType;

  @JoinTable({ name: 'usuarios_credenciales_roles' })
  @ManyToMany(() => Role, (role) => role.users, { cascade: true })
  roles: Role[];

  @DeleteDateColumn()
  deletedAt: Date;
}
