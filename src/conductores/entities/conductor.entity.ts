import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Persona } from "../../personas/entities/persona.entity";

@Entity('conductores')
export class Conductor {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ unique: true })
    licencia?: string;


    @OneToOne(() => Persona, { cascade: true, eager: true })
    @JoinColumn({ name: 'persona_id' })
    persona!: Persona;
}