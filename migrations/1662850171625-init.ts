import { MigrationInterface, QueryRunner } from "typeorm";

export class init1662850171625 implements MigrationInterface {
    name = 'init1662850171625'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`player_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`playerName\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`player_entity\``);
    }

}
