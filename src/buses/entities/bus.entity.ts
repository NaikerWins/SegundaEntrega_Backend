import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Empresa } from "../../empresas/entities/empresa.entity";
import { GPS } from "../../gps/entities/gps.entity";
import { Programacion } from "../../programaciones/entities/programaciones.entity";

@Entity('buses')
export class Bus {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ unique: true })
    placa?: string;

    @Column()
    modelo?: string;

    @Column()
    anio?: number;

    @Column()
    capacidadSentados?: number;

    @Column()
    capacidadParados?: number;

    @Column()
    estado?: string;

    @Column({ nullable: true })
    fotoBus?: string;

    @Column({ unique: true })
    codigoQR?: string;

    @ManyToOne(() => Empresa, (empresa) => empresa.buses, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'empresa_id' })
    empresa?: Empresa;

    @OneToOne(() => GPS, { cascade: true, eager: true })
    @JoinColumn({ name: 'gps_id' })
    gps?: GPS;

    @OneToMany(() => Programacion, (programacion) => programacion.bus)
    programaciones?: Programacion[];
}