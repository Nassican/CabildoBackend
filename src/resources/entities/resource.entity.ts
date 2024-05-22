import { RoleRecurso } from '../../roles/entities/roles-recurso.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('recursos')
export class Recurso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre_recurso: string;

  @OneToMany(() => RoleRecurso, (roleRecurso) => roleRecurso.recurso)
  roleRecursos: RoleRecurso[];
}
