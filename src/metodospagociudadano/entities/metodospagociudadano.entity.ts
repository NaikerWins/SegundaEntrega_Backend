import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { MetodoPago } from '../../metodospago/entities/metodospago.entity';
import { Transaccion } from '../../transacciones/entities/transacciones.entity'

@Entity('metodospagociudadano')
export class MetodoPagoCiudadano {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    id_ciudadano?: string;

    @Column()
    saldo?: number;

    @Column()
    monto?: number;

    @Column()
    cargo?: number;

    @ManyToOne(() => MetodoPago, (metodopago) => metodopago.metodospagociudadano, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'metodopago_id' })
    metodopago?: MetodoPago;

    @OneToMany(() => Transaccion, (transaccion) => transaccion.metodopagociudadano)
    transacciones?: Transaccion[];

}