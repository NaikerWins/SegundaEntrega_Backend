import { MigrationInterface, QueryRunner } from "typeorm";

export class MigracionBuses1778955370817 implements MigrationInterface {
    name = 'MigracionBuses1778955370817'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`personas\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombre\` varchar(255) NOT NULL, \`apellido\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`telefono\` varchar(255) NULL, UNIQUE INDEX \`IDX_6019651944f62d09f56ff66f60\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`conductores\` (\`id\` int NOT NULL AUTO_INCREMENT, \`licencia\` varchar(255) NOT NULL, \`persona_id\` int NULL, UNIQUE INDEX \`IDX_a01e7172ea361195be58ab5962\` (\`licencia\`), UNIQUE INDEX \`REL_bc0266d66cf1bb0692fe14a01c\` (\`persona_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`empresas\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombre\` varchar(255) NOT NULL, \`nit\` varchar(255) NOT NULL, \`telefono\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`activa\` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`gps\` (\`id\` int NOT NULL AUTO_INCREMENT, \`latitud\` decimal(10,7) NOT NULL DEFAULT '0.0000000', \`longitud\` decimal(10,7) NOT NULL DEFAULT '0.0000000', \`activo\` tinyint NOT NULL DEFAULT 0, \`ultimaActualizacion\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`paraderos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombre\` varchar(255) NOT NULL, \`latitud\` int NOT NULL, \`longitud\` int NOT NULL, \`clasificacion\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`nodos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`orden\` int NOT NULL, \`distanciaDesdeAnterior\` decimal(10,2) NULL, \`tiempoEstimado\` int NULL, \`ruta_id\` int NULL, \`paradero_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`rutas\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombre\` varchar(255) NOT NULL, \`codigo\` varchar(255) NOT NULL, \`descripcion\` text NULL, \`tarifa\` decimal(10,2) NOT NULL, \`activa\` tinyint NOT NULL DEFAULT 1, \`tiempo_estimado\` int NULL, UNIQUE INDEX \`IDX_3e124d911cc0232d53384f7b4b\` (\`codigo\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`boletos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`ciudadano_id\` int NOT NULL, \`metodo_pago_id\` int NOT NULL, \`estado\` varchar(255) NOT NULL DEFAULT 'activo', \`paradero_abordaje_id\` int NULL, \`paradero_descenso_id\` int NULL, \`fecha_abordaje\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`fecha_descenso\` datetime NULL, \`monto\` decimal(10,2) NOT NULL, \`programacion_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`programaciones\` (\`id\` int NOT NULL AUTO_INCREMENT, \`salida\` datetime NOT NULL, \`tolerancia\` int NULL, \`estado\` varchar(255) NOT NULL DEFAULT 'programado', \`recurrencia\` varchar(255) NULL, \`conductor_id\` int NULL, \`capacidad_maxima\` int NULL, \`ocupacion_actual\` int NOT NULL DEFAULT '0', \`ruta_id\` int NULL, \`bus_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`buses\` (\`id\` int NOT NULL AUTO_INCREMENT, \`placa\` varchar(255) NOT NULL, \`modelo\` varchar(255) NOT NULL, \`anio\` int NOT NULL, \`capacidadSentados\` int NOT NULL, \`capacidadParados\` int NOT NULL, \`estado\` varchar(255) NOT NULL, \`fotoBus\` varchar(255) NULL, \`codigoQR\` varchar(255) NOT NULL, \`empresa_id\` int NULL, \`gps_id\` int NULL, UNIQUE INDEX \`IDX_e78e1b9df21315024e40a67d02\` (\`placa\`), UNIQUE INDEX \`IDX_c8f2252b39d5ec90ebaee17852\` (\`codigoQR\`), UNIQUE INDEX \`REL_82ab7d96ba98fcc0520d96f9e7\` (\`gps_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`fotos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`url\` varchar(255) NOT NULL, \`incidente_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`comentarios_incidente\` (\`id\` int NOT NULL AUTO_INCREMENT, \`contenido\` text NOT NULL, \`autor\` varchar(255) NOT NULL, \`fecha\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`incidente_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`incidentes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`tipo\` enum ('accidente_menor', 'falla_mecanica', 'congestion_inesperada', 'problema_pasajeros') NOT NULL, \`gravedad\` enum ('bajo', 'medio', 'alto', 'critico') NOT NULL, \`estado\` enum ('pendiente', 'en_revision', 'resuelto') NOT NULL DEFAULT 'pendiente', \`descripcion\` text NOT NULL, \`notificadoSupervisor\` tinyint NOT NULL DEFAULT 0, \`fecha\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`bus_id\` int NULL, \`conductor_id\` int NULL, \`turno_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`turnos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`fechaProgramada\` datetime NULL, \`fechaInicio\` datetime NULL, \`fechaFin\` datetime NULL, \`estado\` enum ('programado', 'en_curso', 'finalizado') NOT NULL DEFAULT 'programado', \`observaciones\` text NULL, \`conductor_id\` int NULL, \`bus_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`metodospago\` (\`id\` int NOT NULL AUTO_INCREMENT, \`tipo\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`metodospagociudadano\` (\`id\` int NOT NULL AUTO_INCREMENT, \`id_ciudadano\` varchar(255) NOT NULL, \`saldo\` int NOT NULL, \`monto\` int NOT NULL, \`cargo\` int NOT NULL, \`metodopago_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`transacciones\` (\`id\` int NOT NULL AUTO_INCREMENT, \`referencia\` varchar(255) NOT NULL, \`monto\` int NOT NULL, \`fecha\` datetime NOT NULL, \`estado\` varchar(255) NOT NULL, \`metodopagociudadanoId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`conductores\` ADD CONSTRAINT \`FK_bc0266d66cf1bb0692fe14a01c6\` FOREIGN KEY (\`persona_id\`) REFERENCES \`personas\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`nodos\` ADD CONSTRAINT \`FK_1db8f2a7fbf11fb7562736c37df\` FOREIGN KEY (\`ruta_id\`) REFERENCES \`rutas\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`nodos\` ADD CONSTRAINT \`FK_d0025d67eea6a1b5e32826b9f2c\` FOREIGN KEY (\`paradero_id\`) REFERENCES \`paraderos\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`boletos\` ADD CONSTRAINT \`FK_365ae3b69628ff0f5c5e24618e0\` FOREIGN KEY (\`programacion_id\`) REFERENCES \`programaciones\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`boletos\` ADD CONSTRAINT \`FK_d2a2fe9d49e3513d9b2d29b938f\` FOREIGN KEY (\`paradero_abordaje_id\`) REFERENCES \`paraderos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`boletos\` ADD CONSTRAINT \`FK_9ec25d3123e49c5f2b74c7f68ad\` FOREIGN KEY (\`paradero_descenso_id\`) REFERENCES \`paraderos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`programaciones\` ADD CONSTRAINT \`FK_84ff5ccccc8d03befac42644d23\` FOREIGN KEY (\`ruta_id\`) REFERENCES \`rutas\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`programaciones\` ADD CONSTRAINT \`FK_268023a8b8d040f970ef1183716\` FOREIGN KEY (\`bus_id\`) REFERENCES \`buses\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`buses\` ADD CONSTRAINT \`FK_45fbb665b161ccb9b63acb9904c\` FOREIGN KEY (\`empresa_id\`) REFERENCES \`empresas\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`buses\` ADD CONSTRAINT \`FK_82ab7d96ba98fcc0520d96f9e73\` FOREIGN KEY (\`gps_id\`) REFERENCES \`gps\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`fotos\` ADD CONSTRAINT \`FK_9c1ce3ec200c87b9ae3a27ed18b\` FOREIGN KEY (\`incidente_id\`) REFERENCES \`incidentes\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comentarios_incidente\` ADD CONSTRAINT \`FK_37b7cfd7450b3a9ddaa9895250b\` FOREIGN KEY (\`incidente_id\`) REFERENCES \`incidentes\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`incidentes\` ADD CONSTRAINT \`FK_55bc91042dbdc44991709babcfa\` FOREIGN KEY (\`bus_id\`) REFERENCES \`buses\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`incidentes\` ADD CONSTRAINT \`FK_e2b913ab9cd15b8ac93e51a76f1\` FOREIGN KEY (\`conductor_id\`) REFERENCES \`conductores\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`incidentes\` ADD CONSTRAINT \`FK_f0f01dd4e8696bc2e27b9043d4b\` FOREIGN KEY (\`turno_id\`) REFERENCES \`turnos\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`turnos\` ADD CONSTRAINT \`FK_3db03ec6ba62996743b23a24b7e\` FOREIGN KEY (\`conductor_id\`) REFERENCES \`conductores\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`turnos\` ADD CONSTRAINT \`FK_321cdd32b08af8ecab080d49f04\` FOREIGN KEY (\`bus_id\`) REFERENCES \`buses\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`metodospagociudadano\` ADD CONSTRAINT \`FK_c77f59278175e2a146dd4f24325\` FOREIGN KEY (\`metodopago_id\`) REFERENCES \`metodospago\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transacciones\` ADD CONSTRAINT \`FK_14eaf29780b39bd6fc2c76a09ed\` FOREIGN KEY (\`metodopagociudadanoId\`) REFERENCES \`metodospagociudadano\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transacciones\` DROP FOREIGN KEY \`FK_14eaf29780b39bd6fc2c76a09ed\``);
        await queryRunner.query(`ALTER TABLE \`metodospagociudadano\` DROP FOREIGN KEY \`FK_c77f59278175e2a146dd4f24325\``);
        await queryRunner.query(`ALTER TABLE \`turnos\` DROP FOREIGN KEY \`FK_321cdd32b08af8ecab080d49f04\``);
        await queryRunner.query(`ALTER TABLE \`turnos\` DROP FOREIGN KEY \`FK_3db03ec6ba62996743b23a24b7e\``);
        await queryRunner.query(`ALTER TABLE \`incidentes\` DROP FOREIGN KEY \`FK_f0f01dd4e8696bc2e27b9043d4b\``);
        await queryRunner.query(`ALTER TABLE \`incidentes\` DROP FOREIGN KEY \`FK_e2b913ab9cd15b8ac93e51a76f1\``);
        await queryRunner.query(`ALTER TABLE \`incidentes\` DROP FOREIGN KEY \`FK_55bc91042dbdc44991709babcfa\``);
        await queryRunner.query(`ALTER TABLE \`comentarios_incidente\` DROP FOREIGN KEY \`FK_37b7cfd7450b3a9ddaa9895250b\``);
        await queryRunner.query(`ALTER TABLE \`fotos\` DROP FOREIGN KEY \`FK_9c1ce3ec200c87b9ae3a27ed18b\``);
        await queryRunner.query(`ALTER TABLE \`buses\` DROP FOREIGN KEY \`FK_82ab7d96ba98fcc0520d96f9e73\``);
        await queryRunner.query(`ALTER TABLE \`buses\` DROP FOREIGN KEY \`FK_45fbb665b161ccb9b63acb9904c\``);
        await queryRunner.query(`ALTER TABLE \`programaciones\` DROP FOREIGN KEY \`FK_268023a8b8d040f970ef1183716\``);
        await queryRunner.query(`ALTER TABLE \`programaciones\` DROP FOREIGN KEY \`FK_84ff5ccccc8d03befac42644d23\``);
        await queryRunner.query(`ALTER TABLE \`boletos\` DROP FOREIGN KEY \`FK_9ec25d3123e49c5f2b74c7f68ad\``);
        await queryRunner.query(`ALTER TABLE \`boletos\` DROP FOREIGN KEY \`FK_d2a2fe9d49e3513d9b2d29b938f\``);
        await queryRunner.query(`ALTER TABLE \`boletos\` DROP FOREIGN KEY \`FK_365ae3b69628ff0f5c5e24618e0\``);
        await queryRunner.query(`ALTER TABLE \`nodos\` DROP FOREIGN KEY \`FK_d0025d67eea6a1b5e32826b9f2c\``);
        await queryRunner.query(`ALTER TABLE \`nodos\` DROP FOREIGN KEY \`FK_1db8f2a7fbf11fb7562736c37df\``);
        await queryRunner.query(`ALTER TABLE \`conductores\` DROP FOREIGN KEY \`FK_bc0266d66cf1bb0692fe14a01c6\``);
        await queryRunner.query(`DROP TABLE \`transacciones\``);
        await queryRunner.query(`DROP TABLE \`metodospagociudadano\``);
        await queryRunner.query(`DROP TABLE \`metodospago\``);
        await queryRunner.query(`DROP TABLE \`turnos\``);
        await queryRunner.query(`DROP TABLE \`incidentes\``);
        await queryRunner.query(`DROP TABLE \`comentarios_incidente\``);
        await queryRunner.query(`DROP TABLE \`fotos\``);
        await queryRunner.query(`DROP INDEX \`REL_82ab7d96ba98fcc0520d96f9e7\` ON \`buses\``);
        await queryRunner.query(`DROP INDEX \`IDX_c8f2252b39d5ec90ebaee17852\` ON \`buses\``);
        await queryRunner.query(`DROP INDEX \`IDX_e78e1b9df21315024e40a67d02\` ON \`buses\``);
        await queryRunner.query(`DROP TABLE \`buses\``);
        await queryRunner.query(`DROP TABLE \`programaciones\``);
        await queryRunner.query(`DROP TABLE \`boletos\``);
        await queryRunner.query(`DROP INDEX \`IDX_3e124d911cc0232d53384f7b4b\` ON \`rutas\``);
        await queryRunner.query(`DROP TABLE \`rutas\``);
        await queryRunner.query(`DROP TABLE \`nodos\``);
        await queryRunner.query(`DROP TABLE \`paraderos\``);
        await queryRunner.query(`DROP TABLE \`gps\``);
        await queryRunner.query(`DROP TABLE \`empresas\``);
        await queryRunner.query(`DROP INDEX \`REL_bc0266d66cf1bb0692fe14a01c\` ON \`conductores\``);
        await queryRunner.query(`DROP INDEX \`IDX_a01e7172ea361195be58ab5962\` ON \`conductores\``);
        await queryRunner.query(`DROP TABLE \`conductores\``);
        await queryRunner.query(`DROP INDEX \`IDX_6019651944f62d09f56ff66f60\` ON \`personas\``);
        await queryRunner.query(`DROP TABLE \`personas\``);
    }

}
