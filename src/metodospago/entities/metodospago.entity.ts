import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { MetodoPagoCiudadano  } from '../../metodospagociudadano/entities/metodospagociudadano.entity';

@Entity('metodospago')
export class MetodoPago {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    tipo?: string;

    @OneToMany(() => MetodoPagoCiudadano, (mpc) => mpc.metodopago)
    metodospagociudadano?: MetodoPagoCiudadano[];

}