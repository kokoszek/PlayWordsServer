import { MigrationInterface, QueryRunner } from "typeorm";

export class init1672952298634 implements MigrationInterface {
    name = 'init1672952298634'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`player_entity\` ADD \`won\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`player_entity\` ADD \`lost\` int NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`player_entity\` DROP COLUMN \`lost\``);
        await queryRunner.query(`ALTER TABLE \`player_entity\` DROP COLUMN \`won\``);
    }

}
