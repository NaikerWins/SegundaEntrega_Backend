import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Ruta } from '../../rutas/entities/ruta.entity';
import { Boleto } from '../../boletos/entities/boleto.entity';

@Entity('programaciones')
export class Programacion {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  bus_id!: number;

  @Column()
  conductor_id!: number;

  @Column({ default: 'activa' })
  estado!: string;

  @Column()
  capacidad_maxima!: number;

  @Column({ default: 0 })
  ocupacion_actual!: number;

  @ManyToOne(() => Ruta, (ruta) => ruta.programaciones)
  @JoinColumn({ name: 'ruta_id' })
  ruta!: Ruta;

  @OneToMany(() => Boleto, (boleto) => boleto.programacion)
  boletos!: Boleto[];
}
