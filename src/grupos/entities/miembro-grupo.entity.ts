import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Grupo } from './grupo.entity';

@Entity('miembros_grupo')
export class MiembroGrupo {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  usuarioId?: string;

  @Column({ default: 'MEMBER' })
  rol?: 'ADMIN' | 'MEMBER';

  @CreateDateColumn()
  unidoEn?: Date;

  @Column({ nullable: true, type: 'datetime' })
  bloqueadoEn?: Date | null;

  @ManyToOne(() => Grupo, (g) => g.miembros, { onDelete: 'CASCADE' })
  grupo?: Grupo;
}