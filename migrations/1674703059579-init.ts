import { MigrationInterface, QueryRunner } from "typeorm";

export class init1674703059579 implements MigrationInterface {
    name = 'init1674703059579'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`encountered_word_jointable\` (\`playerId\` int NOT NULL, \`linkWordId\` int NOT NULL, \`linkMeaningId\` int NOT NULL, \`misses\` int NOT NULL DEFAULT '0', PRIMARY KEY (\`playerId\`, \`linkWordId\`, \`linkMeaningId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`encountered_word_jointable\` ADD CONSTRAINT \`FK_b15d6d871058ac0bc2e79807db3\` FOREIGN KEY (\`playerId\`) REFERENCES \`player_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`encountered_word_jointable\` ADD CONSTRAINT \`FK_8cb1948ef1ba538f337cc3a0d87\` FOREIGN KEY (\`linkWordId\`, \`linkMeaningId\`) REFERENCES \`meaning_word_jointable\`(\`wordId\`,\`meaningId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`encountered_word_jointable\` DROP FOREIGN KEY \`FK_8cb1948ef1ba538f337cc3a0d87\``);
        await queryRunner.query(`ALTER TABLE \`encountered_word_jointable\` DROP FOREIGN KEY \`FK_b15d6d871058ac0bc2e79807db3\``);
        await queryRunner.query(`DROP TABLE \`encountered_word_jointable\``);
    }

}
