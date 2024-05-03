import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'roles'})
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column()
    resources: string;

    @ManyToMany(() => User, users => users.roles)
    users: User[];
}
