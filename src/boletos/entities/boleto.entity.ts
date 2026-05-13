import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Paradero } from '../../paraderos/entities/paradero.entity';
import { Programacion } from 'src/programaciones/entities/programacione.entity';

@Entity('boletos')
export class Boleto {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  ciudadano_id!: number;

  @Column()
  metodo_pago_id!: number;

  @Column({ default: 'activo' })
  estado!: string; // activo, completado, cancelado

  @Column({ nullable: true })
  paradero_abordaje_id!: number;

  @Column({ nullable: true })
  paradero_descenso_id!: number;

  @CreateDateColumn()
  fecha_abordaje!: Date;

  @Column({ nullable: true })
  fecha_descenso!: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  monto!: number;

  @ManyToOne(() => Programacion, (prog) => prog.boletos)
  @JoinColumn({ name: 'programacion_id' })
  programacion!: Programacion;

  @ManyToOne(() => Paradero)
  @JoinColumn({ name: 'paradero_abordaje_id' })
  paradero_abordaje!: Paradero;

  @ManyToOne(() => Paradero)
  @JoinColumn({ name: 'paradero_descenso_id' })
  paradero_descenso!: Paradero;
}
