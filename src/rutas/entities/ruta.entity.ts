import { Programacion } from "src/programaciones/entities/programacione.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Nodo } from "../../nodos/entities/nodo.entity";

@Entity('rutas')
export class Ruta {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    nombre?: string;

    @Column({ unique: true })
    codigo?: string;

    @Column({ type: 'text', nullable: true })
    descripcion?: string;

    @Column('decimal', { precision: 10, scale: 2 })
    tarifa?: number;

    @Column({ default: true })
    activa?: boolean;

    @OneToMany(() => Nodo, (nodo) => nodo.ruta, { cascade: true })
    nodos?: Nodo[];

    @Column({ nullable: true })
    tiempo_estimado!: number;

    @OneToMany(() => Programacion, (programacion) => programacion.ruta)
    programaciones?: Programacion[];
}

