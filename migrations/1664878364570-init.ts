import { MigrationInterface, QueryRunner } from "typeorm";

export class init1664878364570 implements MigrationInterface {
    name = 'init1664878364570'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`word_entity\` ADD \`isPhrasalVerb\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`word_entity\` ADD \`isIdiom\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`word_entity\` DROP COLUMN \`isIdiom\``);
        await queryRunner.query(`ALTER TABLE \`word_entity\` DROP COLUMN \`isPhrasalVerb\``);
    }

}
