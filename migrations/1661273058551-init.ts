import { MigrationInterface, QueryRunner } from "typeorm";

export class init1661273058551 implements MigrationInterface {
    name = 'init1661273058551'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`meaning_entity\` CHANGE \`meaning_lang1_desc\` \`meaning_lang1_desc\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`meaning_entity\` CHANGE \`meaning_lang1_language\` \`meaning_lang1_language\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`meaning_entity\` CHANGE \`meaning_lang1_language\` \`meaning_lang1_language\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`meaning_entity\` CHANGE \`meaning_lang1_desc\` \`meaning_lang1_desc\` varchar(255) NOT NULL`);
    }

}
