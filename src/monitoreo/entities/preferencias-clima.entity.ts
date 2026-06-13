import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('preferencias_clima')
export class PreferenciasClima {
  // ✅ CORREGIDO: ! (definite assignment assertion) elimina los errores ts(2564)
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  ciudadano_id!: string;

  @Column({ default: 'Bogotá' })
  ciudad!: string;

  @Column({ type: 'time' })
  horario_viaje!: string; // formato 'HH:mm' o 'HH:mm:ss'

  @Column({ default: true })
  alertas_activas!: boolean;

  @Column({ default: 'push' }) // push, email, whatsapp
  canal_preferido!: string;
}