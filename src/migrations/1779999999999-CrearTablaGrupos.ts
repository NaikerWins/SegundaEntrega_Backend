import { MigrationInterface, QueryRunner } from 'typeorm';

export class CrearTablaGrupos1779999999999 implements MigrationInterface {
  name = 'CrearTablaGrupos1779999999999';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`grupos\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`nombre\` varchar(100) NOT NULL,
        \`descripcion\` text NULL,
        \`tipo\` varchar(10) NOT NULL DEFAULT 'PUBLIC',
        \`creadoPor\` varchar(255) NULL,
        \`creadoEn\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`miembros_grupo\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`usuarioId\` varchar(255) NOT NULL,
        \`rol\` varchar(10) NOT NULL DEFAULT 'MEMBER',
        \`unidoEn\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`bloqueadoEn\` datetime NULL,
        \`grupoId\` int NULL,
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_miembro_grupo\`
          FOREIGN KEY (\`grupoId\`) REFERENCES \`grupos\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`miembros_grupo\` DROP FOREIGN KEY \`FK_miembro_grupo\``);
    await queryRunner.query(`DROP TABLE \`miembros_grupo\``);
    await queryRunner.query(`DROP TABLE \`grupos\``);
  }
}