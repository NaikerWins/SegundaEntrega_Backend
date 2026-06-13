import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("pqrs")
export class Pqrs {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ unique: true })
    radicado?: string;

    @Column()
    tipo?: string;

    @Column()
    categoria?: string;

    @Column({ type: "text" })
    descripcion?: string;

    @Column()
    email?: string;

    @Column({ default: "RECIBIDO" })
    estado?: string;

    @Column({ nullable: true })
    ciudadanoId?: string;

    @Column({ nullable: true, type: 'text' })
    respuesta?: string;

    @CreateDateColumn()
    creadoEn?: Date;

    @Column({ nullable: true, type: "datetime" })
    fechaLimite?: Date;
}