import { MigrationInterface, QueryRunner } from "typeorm";

export class init1660942500598 implements MigrationInterface {
    name = 'init1660942500598'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`word_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`lang_polish\` varchar(255) NULL, \`lang_english\` varchar(255) NOT NULL UNIQUE, \`level\` varchar(255) NULL, \`freq\` int NOT NULL, \`desc\` varchar(255) NULL DEFAULT '', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`word_entity\``);
    }

}
