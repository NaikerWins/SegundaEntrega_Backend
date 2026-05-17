import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MetodoPagoCiudadano } from "../../metodospagociudadano/entities/metodospagociudadano.entity";

@Entity('transacciones')
export class Transaccion {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    referencia?: string;

    @Column()
    monto?: number;

    @Column({ type: 'datetime' })
    fecha?: Date;

    @Column()
    estado?: string;

    @ManyToOne(() => MetodoPagoCiudadano, (mpc) => mpc.transacciones)
    metodopagociudadano?: MetodoPagoCiudadano;

}

