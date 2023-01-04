import { MigrationInterface, QueryRunner } from "typeorm";

export class init1672690426617 implements MigrationInterface {
    name = 'init1672690426617'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`word_entity\` ADD \`needsTranslation\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`word_entity\` DROP COLUMN \`needsTranslation\``);
    }

}
