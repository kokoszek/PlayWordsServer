import { MigrationInterface, QueryRunner } from "typeorm";

export class init1661005480049 implements MigrationInterface {
    name = 'init1661005480049'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`lang_english\` ON \`word_entity\``);
        await queryRunner.query(`ALTER TABLE \`word_entity\` ADD \`desc_polish\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`word_entity\` ADD UNIQUE INDEX \`IDX_f472f87e9a69eac88f90300550\` (\`lang_english\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`word_entity\` DROP INDEX \`IDX_f472f87e9a69eac88f90300550\``);
        await queryRunner.query(`ALTER TABLE \`word_entity\` DROP COLUMN \`desc_polish\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`lang_english\` ON \`word_entity\` (\`lang_english\`)`);
    }

}
