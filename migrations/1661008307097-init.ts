import { MigrationInterface, QueryRunner } from "typeorm";

export class init1661008307097 implements MigrationInterface {
    name = 'init1661008307097'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_f472f87e9a69eac88f90300550\` ON \`word_entity\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_f472f87e9a69eac88f90300550\` ON \`word_entity\` (\`lang_english\`)`);
    }

}
