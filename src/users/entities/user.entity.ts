import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity('usuarios_credenciales')
export class User {
    @PrimaryGeneratedColumn()
    id_usuario: number;

    @Column({unique: true, nullable: false})
    num_documento: string;

    @Column()
    nombres: string;

    @Column()
    apellidos: string;

    @Column({nullable: false})
    password: string;

    @Column({nullable: true})
    huella_digital: BinaryType;

    @Column({default: 'user'})
    role: string;

    @DeleteDateColumn()
    deletedAt: Date;
}