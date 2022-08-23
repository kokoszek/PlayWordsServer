import { MigrationInterface, QueryRunner } from "typeorm";

export class init1661237198797 implements MigrationInterface {
    name = 'init1661237198797'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`meaning_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`meaning_desc\` varchar(255) NOT NULL, \`meaning_desc_lang\` varchar(255) NOT NULL, \`partOfSpeech\` varchar(255) NULL, \`category\` varchar(255) NOT NULL DEFAULT 'common', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`word_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`word\` varchar(255) NOT NULL, \`desc\` varchar(255) NULL, \`level\` varchar(255) NULL, \`lang\` varchar(255) NOT NULL, \`freq\` int NOT NULL DEFAULT '1', \`origin\` varchar(255) NULL DEFAULT '', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`meaning_entity_words_word_entity\` (\`meaningEntityId\` int NOT NULL, \`wordEntityId\` int NOT NULL, INDEX \`IDX_cbd8d7b6f2b7397d529824886d\` (\`meaningEntityId\`), INDEX \`IDX_f4e2f5dea409e617a622c1aab8\` (\`wordEntityId\`), PRIMARY KEY (\`meaningEntityId\`, \`wordEntityId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`meaning_entity_words_word_entity\` ADD CONSTRAINT \`FK_cbd8d7b6f2b7397d529824886d3\` FOREIGN KEY (\`meaningEntityId\`) REFERENCES \`meaning_entity\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`meaning_entity_words_word_entity\` ADD CONSTRAINT \`FK_f4e2f5dea409e617a622c1aab87\` FOREIGN KEY (\`wordEntityId\`) REFERENCES \`word_entity\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`meaning_entity_words_word_entity\` DROP FOREIGN KEY \`FK_f4e2f5dea409e617a622c1aab87\``);
        await queryRunner.query(`ALTER TABLE \`meaning_entity_words_word_entity\` DROP FOREIGN KEY \`FK_cbd8d7b6f2b7397d529824886d3\``);
        await queryRunner.query(`DROP INDEX \`IDX_f4e2f5dea409e617a622c1aab8\` ON \`meaning_entity_words_word_entity\``);
        await queryRunner.query(`DROP INDEX \`IDX_cbd8d7b6f2b7397d529824886d\` ON \`meaning_entity_words_word_entity\``);
        await queryRunner.query(`DROP TABLE \`meaning_entity_words_word_entity\``);
        await queryRunner.query(`DROP TABLE \`word_entity\``);
        await queryRunner.query(`DROP TABLE \`meaning_entity\``);
    }

}
