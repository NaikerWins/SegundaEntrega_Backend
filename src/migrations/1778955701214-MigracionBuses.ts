import { MigrationInterface, QueryRunner } from "typeorm";

export class MigracionBuses1778955701214 implements MigrationInterface {
    name = 'MigracionBuses1778955701214'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`programaciones\` (\`id\` int NOT NULL AUTO_INCREMENT, \`salida\` datetime NOT NULL, \`tolerancia\` int NULL, \`estado\` varchar(255) NOT NULL DEFAULT 'programado', \`recurrencia\` varchar(255) NULL, \`conductor_id\` int NULL, \`capacidad_maxima\` int NULL, \`ocupacion_actual\` int NOT NULL DEFAULT '0', \`ruta_id\` int NULL, \`bus_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`metodospago\` (\`id\` int NOT NULL AUTO_INCREMENT, \`tipo\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`metodospagociudadano\` (\`id\` int NOT NULL AUTO_INCREMENT, \`id_ciudadano\` varchar(255) NOT NULL, \`saldo\` int NOT NULL, \`monto\` int NOT NULL, \`cargo\` int NOT NULL, \`metodopago_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`transacciones\` (\`id\` int NOT NULL AUTO_INCREMENT, \`referencia\` varchar(255) NOT NULL, \`monto\` int NOT NULL, \`fecha\` datetime NOT NULL, \`estado\` varchar(255) NOT NULL, \`metodopagociudadanoId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`boletos\` DROP COLUMN \`marca_fin\``);
        await queryRunner.query(`ALTER TABLE \`boletos\` DROP COLUMN \`marca_inicio\``);
        await queryRunner.query(`ALTER TABLE \`rutas\` ADD \`tiempo_estimado\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`boletos\` ADD \`ciudadano_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`boletos\` ADD \`metodo_pago_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`boletos\` ADD \`paradero_abordaje_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`boletos\` ADD \`paradero_descenso_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`boletos\` ADD \`fecha_abordaje\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`boletos\` ADD \`fecha_descenso\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`boletos\` ADD \`monto\` decimal(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`boletos\` ADD \`programacion_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`boletos\` DROP COLUMN \`estado\``);
        await queryRunner.query(`ALTER TABLE \`boletos\` ADD \`estado\` varchar(255) NOT NULL DEFAULT 'activo'`);
        await queryRunner.query(`ALTER TABLE \`boletos\` ADD CONSTRAINT \`FK_365ae3b69628ff0f5c5e24618e0\` FOREIGN KEY (\`programacion_id\`) REFERENCES \`programaciones\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`boletos\` ADD CONSTRAINT \`FK_d2a2fe9d49e3513d9b2d29b938f\` FOREIGN KEY (\`paradero_abordaje_id\`) REFERENCES \`paraderos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`boletos\` ADD CONSTRAINT \`FK_9ec25d3123e49c5f2b74c7f68ad\` FOREIGN KEY (\`paradero_descenso_id\`) REFERENCES \`paraderos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`programaciones\` ADD CONSTRAINT \`FK_84ff5ccccc8d03befac42644d23\` FOREIGN KEY (\`ruta_id\`) REFERENCES \`rutas\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`programaciones\` ADD CONSTRAINT \`FK_268023a8b8d040f970ef1183716\` FOREIGN KEY (\`bus_id\`) REFERENCES \`buses\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`metodospagociudadano\` ADD CONSTRAINT \`FK_c77f59278175e2a146dd4f24325\` FOREIGN KEY (\`metodopago_id\`) REFERENCES \`metodospago\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transacciones\` ADD CONSTRAINT \`FK_14eaf29780b39bd6fc2c76a09ed\` FOREIGN KEY (\`metodopagociudadanoId\`) REFERENCES \`metodospagociudadano\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transacciones\` DROP FOREIGN KEY \`FK_14eaf29780b39bd6fc2c76a09ed\``);
        await queryRunner.query(`ALTER TABLE \`metodospagociudadano\` DROP FOREIGN KEY \`FK_c77f59278175e2a146dd4f24325\``);
        await queryRunner.query(`ALTER TABLE \`programaciones\` DROP FOREIGN KEY \`FK_268023a8b8d040f970ef1183716\``);
        await queryRunner.query(`ALTER TABLE \`programaciones\` DROP FOREIGN KEY \`FK_84ff5ccccc8d03befac42644d23\``);
        await queryRunner.query(`ALTER TABLE \`boletos\` DROP FOREIGN KEY \`FK_9ec25d3123e49c5f2b74c7f68ad\``);
        await queryRunner.query(`ALTER TABLE \`boletos\` DROP FOREIGN KEY \`FK_d2a2fe9d49e3513d9b2d29b938f\``);
        await queryRunner.query(`ALTER TABLE \`boletos\` DROP FOREIGN KEY \`FK_365ae3b69628ff0f5c5e24618e0\``);
        await queryRunner.query(`ALTER TABLE \`boletos\` DROP COLUMN \`estado\``);
        await queryRunner.query(`ALTER TABLE \`boletos\` ADD \`estado\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`boletos\` DROP COLUMN \`programacion_id\``);
        await queryRunner.query(`ALTER TABLE \`boletos\` DROP COLUMN \`monto\``);
        await queryRunner.query(`ALTER TABLE \`boletos\` DROP COLUMN \`fecha_descenso\``);
        await queryRunner.query(`ALTER TABLE \`boletos\` DROP COLUMN \`fecha_abordaje\``);
        await queryRunner.query(`ALTER TABLE \`boletos\` DROP COLUMN \`paradero_descenso_id\``);
        await queryRunner.query(`ALTER TABLE \`boletos\` DROP COLUMN \`paradero_abordaje_id\``);
        await queryRunner.query(`ALTER TABLE \`boletos\` DROP COLUMN \`metodo_pago_id\``);
        await queryRunner.query(`ALTER TABLE \`boletos\` DROP COLUMN \`ciudadano_id\``);
        await queryRunner.query(`ALTER TABLE \`rutas\` DROP COLUMN \`tiempo_estimado\``);
        await queryRunner.query(`ALTER TABLE \`boletos\` ADD \`marca_inicio\` date NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`boletos\` ADD \`marca_fin\` date NOT NULL`);
        await queryRunner.query(`DROP TABLE \`transacciones\``);
        await queryRunner.query(`DROP TABLE \`metodospagociudadano\``);
        await queryRunner.query(`DROP TABLE \`metodospago\``);
        await queryRunner.query(`DROP TABLE \`programaciones\``);
    }

}
