import { MigrationInterface, QueryRunner } from "typeorm";

export class init1661170851842 implements MigrationInterface {
    name = 'init1661170851842'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`meaning_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`meaning\` varchar(255) NOT NULL, \`partOfSpeech\` varchar(255) NULL, \`category\` varchar(255) NOT NULL DEFAULT 'common', \`meaning_lang\` varchar(255) NOT NULL, \`level\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`word_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`word\` varchar(255) NOT NULL, \`desc\` varchar(255) NULL, \`lang\` varchar(255) NOT NULL, \`freq\` int NOT NULL, \`origin\` varchar(255) NULL DEFAULT '', \`meaningId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`word_entity\` ADD CONSTRAINT \`FK_1a1a161d83eab8340923edd8560\` FOREIGN KEY (\`meaningId\`) REFERENCES \`meaning_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`word_entity\` DROP FOREIGN KEY \`FK_1a1a161d83eab8340923edd8560\``);
        await queryRunner.query(`DROP TABLE \`word_entity\``);
        await queryRunner.query(`DROP TABLE \`meaning_entity\``);
    }

}
