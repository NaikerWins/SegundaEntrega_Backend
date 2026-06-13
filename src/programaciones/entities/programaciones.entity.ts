import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Ruta } from '../../rutas/entities/ruta.entity';
import { Bus } from '../../buses/entities/bus.entity';
import { Boleto } from '../../boletos/entities/boleto.entity';
import { Conductor } from '../../conductores/entities/conductor.entity';

@Entity('programaciones')
export class Programacion {
    @PrimaryGeneratedColumn()
    id?: number;

    // Campos de tu HU-011
    @Column({ type: 'datetime' })
    salida?: Date;

    @Column({ nullable: true })
    tolerancia?: number;

    @Column({ default: 'activa' })
    estado?: string;

    @Column({ nullable: true })
    recurrencia?: string;

    // Campos del Integrante 1
    @Column({ nullable: true })
    conductor_id?: number;

    @Column({ nullable: true })
    capacidad_maxima?: number;

    @Column({ default: 0 })
    ocupacion_actual?: number;

    @ManyToOne(() => Conductor, { onDelete: 'SET NULL' })
@JoinColumn({ name: 'conductor_id' })
conductor?: Conductor;

    // Relaciones
    @ManyToOne(() => Ruta, (ruta) => ruta.programaciones, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'ruta_id' })
    ruta?: Ruta;

    @ManyToOne(() => Bus, (bus) => bus.programaciones, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'bus_id' })
    bus?: Bus;

    @OneToMany(() => Boleto, (boleto) => boleto.programacion)
    boletos?: Boleto[];
}