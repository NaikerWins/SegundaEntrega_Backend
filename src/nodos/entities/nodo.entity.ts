import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Ruta } from '../../rutas/entities/ruta.entity';
import { Paradero } from '../../paraderos/entities/paradero.entity';

@Entity('nodos')
export class Nodo {
  @PrimaryGeneratedColumn()
  id!: number;

    @Column()
    orden?: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    distanciaDesdeAnterior?: number;

    @Column({ nullable: true })
    tiempoEstimado?: number; // en minutos

    @ManyToOne(() => Ruta, (ruta) => ruta.nodos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'ruta_id' })
    ruta?: Ruta;

    @ManyToOne(() => Paradero, (paradero) => paradero.nodos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'paradero_id' })
    paradero?: Paradero;
}
