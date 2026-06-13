import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("preferencias_clima")
export class PreferenciaClima {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ unique: true })
    usuarioId?: string;

    @Column({ default: true })
    alertasActivas?: boolean;

    @Column({ default: "07:00" })
    horarioViaje?: string;

    @Column()
    email?: string;

    @CreateDateColumn()
    creadoEn?: Date;
}