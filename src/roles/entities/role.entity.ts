import { User } from "../../users/entities/user.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RoleRecurso } from "./roles-recurso.entity";

@Entity({ name: 'roles'})
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @OneToMany(() => RoleRecurso, roleRecurso => roleRecurso.role)
    roleRecursos: RoleRecurso[];

    @ManyToMany(() => User, users => users.roles, )
    users: User[];
}
