import { MigrationInterface, QueryRunner } from "typeorm";

export class init1675954411235 implements MigrationInterface {
    name = 'init1675954411235'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`player_entity\` ADD \`playedTasks\` int NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`player_entity\` DROP COLUMN \`playedTasks\``);
    }

}
