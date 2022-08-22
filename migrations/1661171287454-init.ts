import { MigrationInterface, QueryRunner } from "typeorm";

export class init1661171287454 implements MigrationInterface {
    name = 'init1661171287454'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`word_entity\` CHANGE \`freq\` \`freq\` int NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`word_entity\` CHANGE \`freq\` \`freq\` int NOT NULL`);
    }

}
