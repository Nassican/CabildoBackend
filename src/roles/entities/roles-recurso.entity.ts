import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from './role.entity';
import { Recurso } from '../../resources/entities/resource.entity';

@Entity('roles_recursos')
export class RoleRecurso {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Role, role => role.roleRecursos)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => Recurso, recurso => recurso.roleRecursos)
  @JoinColumn({ name: 'recurso_id' })
  recurso: Recurso;
}