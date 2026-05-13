import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Ruta } from "../../rutas/entities/ruta.entity";
import { Bus } from "../../buses/entities/bus.entity";

@Entity('programaciones')
export class Programacion {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: 'datetime' })
    salida?: Date;

    @Column()
    tolerancia?: number;

    @Column()
    estado?: string;

    @Column()
    recurrencia?: string;

    @ManyToOne(() => Ruta, (ruta) => ruta.programaciones, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'ruta_id' })
    ruta?: Ruta;

    @ManyToOne(() => Bus, (bus) => bus.programaciones, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'bus_id' })
    bus?: Bus;

}