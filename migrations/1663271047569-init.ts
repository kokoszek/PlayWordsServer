import { MigrationInterface, QueryRunner } from "typeorm";

export class init1663271047569 implements MigrationInterface {
    name = 'init1663271047569'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX \`IDX_53d2b048e575da6774bd905a64\` ON \`word_particle\` (\`wordParticle\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_53d2b048e575da6774bd905a64\` ON \`word_particle\``);
    }

}
