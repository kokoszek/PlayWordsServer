import { MigrationInterface, QueryRunner } from "typeorm";

export class init1661007486487 implements MigrationInterface {
    name = 'init1661007486487'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`word_entity\` CHANGE \`desc\` \`origin\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`word_entity\` DROP COLUMN \`origin\``);
        await queryRunner.query(`ALTER TABLE \`word_entity\` ADD \`origin\` varchar(255) NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`word_entity\` DROP COLUMN \`origin\``);
        await queryRunner.query(`ALTER TABLE \`word_entity\` ADD \`origin\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`word_entity\` CHANGE \`origin\` \`desc\` varchar(255) NULL DEFAULT ''`);
    }

}
