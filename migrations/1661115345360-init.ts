import { MigrationInterface, QueryRunner } from "typeorm";

export class init1661115345360 implements MigrationInterface {
    name = 'init1661115345360'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`meaning_entity\` ADD \`partOfSpeech\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`meaning_entity\` ADD \`category\` varchar(255) NOT NULL DEFAULT 'common'`);
        await queryRunner.query(`ALTER TABLE \`meaning_entity\` CHANGE \`level\` \`level\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`meaning_entity\` CHANGE \`level\` \`level\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`meaning_entity\` DROP COLUMN \`category\``);
        await queryRunner.query(`ALTER TABLE \`meaning_entity\` DROP COLUMN \`partOfSpeech\``);
    }

}
