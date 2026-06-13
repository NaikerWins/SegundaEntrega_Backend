import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { GrupoPersona } from './grupo-persona.entity';
import { MiembroGrupo } from './miembro-grupo.entity';
import { DestinatarioGrupo } from '../../mensajes/entities/destinatario-grupo.entity';

@Entity('grupos')
export class Grupo {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  nombre?: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ nullable: true })
  imagen?: string;

  @Column({ default: 'PUBLIC' })
  tipo?: string;

  @Column({ nullable: true })
  adminId?: string;

  @Column({ nullable: true })
  adminNombre?: string;

  @Column({ nullable: true })
  creadoPor?: string;

  @Column({ default: true })
  activo?: boolean;

  @CreateDateColumn()
  fechaCreacion?: Date;

  @CreateDateColumn()
  creadoEn?: Date;

  @OneToMany(() => GrupoPersona, (gp) => gp.grupo, { cascade: true })
  miembros?: GrupoPersona[];

  @OneToMany(() => MiembroGrupo, (m) => m.grupo, { cascade: true })
  miembrosGrupo?: MiembroGrupo[];

  @OneToMany(() => DestinatarioGrupo, (dg) => dg.grupo)
  mensajes?: DestinatarioGrupo[];
}