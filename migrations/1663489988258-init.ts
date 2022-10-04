import { MigrationInterface, QueryRunner } from "typeorm";

export class init1663489988258 implements MigrationInterface {
  name = "init1663489988258";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE \`player_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`playerName\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    await queryRunner.query(`CREATE TABLE \`meaning_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`meaning_lang1_desc\` varchar(255) NULL, \`meaning_lang1_language\` varchar(255) NULL, \`meaning_lang2_desc\` varchar(255) NULL, \`meaning_lang2_language\` varchar(255) NULL, \`partOfSpeech\` varchar(255) NULL, \`category\` varchar(255) NOT NULL DEFAULT 'common', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    await queryRunner.query(`CREATE TABLE \`meaning_word_jointable\` (\`wordId\` int NOT NULL, \`meaningId\` int NOT NULL, \`level\` varchar(255) NOT NULL, PRIMARY KEY (\`wordId\`, \`meaningId\`)) ENGINE=InnoDB`);
    await queryRunner.query(`CREATE TABLE \`word_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`word\` varchar(255) NOT NULL, \`desc\` varchar(255) NULL, \`lang\` varchar(255) NOT NULL, \`freq\` int NOT NULL DEFAULT '1', \`origin\` varchar(255) NULL DEFAULT '', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    await queryRunner.query(`CREATE TABLE \`word_particle\` (\`id\` int NOT NULL AUTO_INCREMENT, \`wordParticle\` varchar(255) NOT NULL, \`wordEntityId\` int NULL, INDEX \`IDX_53d2b048e575da6774bd905a64\` (\`wordParticle\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    await queryRunner.query(`ALTER TABLE \`meaning_word_jointable\` ADD CONSTRAINT \`FK_89ed46f16558c256c58d83b3a76\` FOREIGN KEY (\`meaningId\`) REFERENCES \`meaning_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE \`meaning_word_jointable\` ADD CONSTRAINT \`FK_153c85001545f085f0289a6443f\` FOREIGN KEY (\`wordId\`) REFERENCES \`word_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE \`word_particle\` ADD CONSTRAINT \`FK_23bc143e9309245d0366b56e895\` FOREIGN KEY (\`wordEntityId\`) REFERENCES \`word_entity\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`word_particle\` DROP FOREIGN KEY \`FK_23bc143e9309245d0366b56e895\``);
    await queryRunner.query(`ALTER TABLE \`meaning_word_jointable\` DROP FOREIGN KEY \`FK_153c85001545f085f0289a6443f\``);
    await queryRunner.query(`ALTER TABLE \`meaning_word_jointable\` DROP FOREIGN KEY \`FK_89ed46f16558c256c58d83b3a76\``);
    await queryRunner.query(`DROP INDEX \`IDX_53d2b048e575da6774bd905a64\` ON \`word_particle\``);
    await queryRunner.query(`DROP TABLE \`word_particle\``);
    await queryRunner.query(`DROP TABLE \`word_entity\``);
    await queryRunner.query(`DROP TABLE \`meaning_word_jointable\``);
    await queryRunner.query(`DROP TABLE \`meaning_entity\``);
    await queryRunner.query(`DROP TABLE \`player_entity\``);
  }

}
