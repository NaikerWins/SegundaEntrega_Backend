import { MigrationInterface, QueryRunner } from "typeorm";

export class InitCinemaSchema1781376859943 implements MigrationInterface {
    name = 'InitCinemaSchema1781376859943'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_4046f820163df3d7361fd7876c\` ON \`preferencias_clima\``);
        await queryRunner.query(`ALTER TABLE \`preferencias_clima\` DROP COLUMN \`ciudadano_id\``);
        await queryRunner.query(`ALTER TABLE \`preferencias_clima\` DROP COLUMN \`ciudad\``);
        await queryRunner.query(`ALTER TABLE \`preferencias_clima\` DROP COLUMN \`horario_viaje\``);
        await queryRunner.query(`ALTER TABLE \`preferencias_clima\` DROP COLUMN \`alertas_activas\``);
        await queryRunner.query(`ALTER TABLE \`preferencias_clima\` DROP COLUMN \`canal_preferido\``);
        await queryRunner.query(`ALTER TABLE \`preferencias_clima\` DROP COLUMN \`usuarioId\``);
        await queryRunner.query(`ALTER TABLE \`preferencias_clima\` DROP COLUMN \`alertasActivas\``);
        await queryRunner.query(`ALTER TABLE \`preferencias_clima\` DROP COLUMN \`horarioViaje\``);
        await queryRunner.query(`ALTER TABLE \`preferencias_clima\` DROP COLUMN \`email\``);
        await queryRunner.query(`ALTER TABLE \`preferencias_clima\` DROP COLUMN \`creadoEn\``);
        await queryRunner.query(`ALTER TABLE \`preferencias_clima\` ADD \`usuarioId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`preferencias_clima\` ADD UNIQUE INDEX \`IDX_4046f820163df3d7361fd7876c\` (\`usuarioId\`)`);
        await queryRunner.query(`ALTER TABLE \`preferencias_clima\` ADD \`alertasActivas\` tinyint NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`preferencias_clima\` ADD \`horarioViaje\` varchar(255) NOT NULL DEFAULT '07:00'`);
        await queryRunner.query(`ALTER TABLE \`preferencias_clima\` ADD \`email\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`preferencias_clima\` ADD \`creadoEn\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`preferencias_clima\` ADD \`ciudadano_id\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`preferencias_clima\` ADD \`ciudad\` varchar(255) NOT NULL DEFAULT 'Bogotá'`);
        await queryRunner.query(`ALTER TABLE \`preferencias_clima\` ADD \`horario_viaje\` time NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`preferencias_clima\` ADD \`alertas_activas\` tinyint NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`preferencias_clima\` ADD \`canal_preferido\` varchar(255) NOT NULL DEFAULT 'push'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`preferencias_clima\` DROP COLUMN \`canal_preferido\``);
        await queryRunner.query(`ALTER TABLE \`preferencias_clima\` DROP COLUMN \`alertas_activas\``);
        await queryRunner.query(`ALTER TABLE \`preferencias_clima\` DROP COLUMN \`horario_viaje\``);
        await queryRunner.query(`ALTER TABLE \`preferencias_clima\` DROP COLUMN \`ciudad\``);
        await queryRunner.query(`ALTER TABLE \`preferencias_clima\` DROP COLUMN \`ciudadano_id\``);
        await queryRunner.query(`ALTER TABLE \`preferencias_clima\` DROP COLUMN \`creadoEn\``);
        await queryRunner.query(`ALTER TABLE \`preferencias_clima\` DROP COLUMN \`email\``);
        await queryRunner.query(`ALTER TABLE \`preferencias_clima\` DROP COLUMN \`horarioViaje\``);
        await queryRunner.query(`ALTER TABLE \`preferencias_clima\` DROP COLUMN \`alertasActivas\``);
        await queryRunner.query(`ALTER TABLE \`preferencias_clima\` DROP INDEX \`IDX_4046f820163df3d7361fd7876c\``);
        await queryRunner.query(`ALTER TABLE \`preferencias_clima\` DROP COLUMN \`usuarioId\``);
        await queryRunner.query(`ALTER TABLE \`preferencias_clima\` ADD \`creadoEn\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`preferencias_clima\` ADD \`email\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`preferencias_clima\` ADD \`horarioViaje\` varchar(255) NOT NULL DEFAULT '07:00'`);
        await queryRunner.query(`ALTER TABLE \`preferencias_clima\` ADD \`alertasActivas\` tinyint NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`preferencias_clima\` ADD \`usuarioId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`preferencias_clima\` ADD \`canal_preferido\` varchar(255) NOT NULL DEFAULT 'push'`);
        await queryRunner.query(`ALTER TABLE \`preferencias_clima\` ADD \`alertas_activas\` tinyint NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`preferencias_clima\` ADD \`horario_viaje\` time NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`preferencias_clima\` ADD \`ciudad\` varchar(255) NOT NULL DEFAULT 'Bogotá'`);
        await queryRunner.query(`ALTER TABLE \`preferencias_clima\` ADD \`ciudadano_id\` varchar(255) NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_4046f820163df3d7361fd7876c\` ON \`preferencias_clima\` (\`usuarioId\`)`);
    }

}
