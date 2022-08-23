import { MigrationInterface, QueryRunner } from "typeorm";

export class init1661259364948 implements MigrationInterface {
    name = 'init1661259364948'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`meaning_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`meaning_lang1_desc\` varchar(255) NOT NULL, \`meaning_lang1_language\` varchar(255) NOT NULL, \`meaning_lang2_desc\` varchar(255) NULL, \`meaning_lang2_language\` varchar(255) NULL, \`partOfSpeech\` varchar(255) NULL, \`category\` varchar(255) NOT NULL DEFAULT 'common', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`word_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`word\` varchar(255) NOT NULL, \`desc\` varchar(255) NULL, \`level\` varchar(255) NULL, \`lang\` varchar(255) NOT NULL, \`freq\` int NOT NULL DEFAULT '1', \`origin\` varchar(255) NULL DEFAULT '', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`meaning_word_jointable\` (\`meaningEntityId\` int NOT NULL, \`wordEntityId\` int NOT NULL, INDEX \`IDX_7dc1e1b1be1c1ed82696da467d\` (\`meaningEntityId\`), INDEX \`IDX_b940e89d6c959adb15c1db5e83\` (\`wordEntityId\`), PRIMARY KEY (\`meaningEntityId\`, \`wordEntityId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`meaning_word_jointable\` ADD CONSTRAINT \`FK_7dc1e1b1be1c1ed82696da467d6\` FOREIGN KEY (\`meaningEntityId\`) REFERENCES \`meaning_entity\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`meaning_word_jointable\` ADD CONSTRAINT \`FK_b940e89d6c959adb15c1db5e83a\` FOREIGN KEY (\`wordEntityId\`) REFERENCES \`word_entity\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`meaning_word_jointable\` DROP FOREIGN KEY \`FK_b940e89d6c959adb15c1db5e83a\``);
        await queryRunner.query(`ALTER TABLE \`meaning_word_jointable\` DROP FOREIGN KEY \`FK_7dc1e1b1be1c1ed82696da467d6\``);
        await queryRunner.query(`DROP INDEX \`IDX_b940e89d6c959adb15c1db5e83\` ON \`meaning_word_jointable\``);
        await queryRunner.query(`DROP INDEX \`IDX_7dc1e1b1be1c1ed82696da467d\` ON \`meaning_word_jointable\``);
        await queryRunner.query(`DROP TABLE \`meaning_word_jointable\``);
        await queryRunner.query(`DROP TABLE \`word_entity\``);
        await queryRunner.query(`DROP TABLE \`meaning_entity\``);
    }

}
