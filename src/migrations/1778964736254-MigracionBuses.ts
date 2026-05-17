import { MigrationInterface, QueryRunner } from "typeorm";

export class MigracionBuses1778964736254 implements MigrationInterface {
    name = 'MigracionBuses1778964736254'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`boletos\` DROP COLUMN \`ciudadano_id\``);
        await queryRunner.query(`ALTER TABLE \`boletos\` ADD \`ciudadano_id\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`boletos\` DROP COLUMN \`ciudadano_id\``);
        await queryRunner.query(`ALTER TABLE \`boletos\` ADD \`ciudadano_id\` int NOT NULL`);
    }

}
