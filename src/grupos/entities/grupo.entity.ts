import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import { MiembroGrupo } from './miembro-grupo.entity';

@Entity('grupos')
export class Grupo {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  nombre?: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ default: 'PUBLIC' })
  tipo?: 'PUBLIC' | 'PRIVATE';

  @Column({ nullable: true })
  creadoPor?: string;

  @CreateDateColumn()
  creadoEn?: Date;

  @OneToMany(() => MiembroGrupo, (m) => m.grupo, { cascade: true })
  miembros?: MiembroGrupo[];
}