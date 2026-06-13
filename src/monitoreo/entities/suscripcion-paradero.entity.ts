import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('suscripciones_paradero')
export class SuscripcionParadero {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ciudadano_id: string;

  @Column()
  ruta_id: number;

  @Column()
  paradero_id: number;

  @Column()
  minutos_anticipacion: number; // 5,10,15

  @Column({ default: true })
  activa: boolean;
}