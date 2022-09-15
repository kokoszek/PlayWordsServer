import { MigrationInterface, QueryRunner } from "typeorm";

export class init1663269462339 implements MigrationInterface {
    name = 'init1663269462339'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`word_particle\` (\`id\` int NOT NULL AUTO_INCREMENT, \`wordParticle\` varchar(255) NOT NULL, \`wordEntityId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`word_particle\` ADD CONSTRAINT \`FK_23bc143e9309245d0366b56e895\` FOREIGN KEY (\`wordEntityId\`) REFERENCES \`word_entity\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`word_particle\` DROP FOREIGN KEY \`FK_23bc143e9309245d0366b56e895\``);
        await queryRunner.query(`DROP TABLE \`word_particle\``);
    }

}
