import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserToken1754305493504 implements MigrationInterface {
    name = 'AddUserToken1754305493504'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PatientInsurance" DROP CONSTRAINT "FK_5e9c80d860ab95f054323c2cf2b"`);
        await queryRunner.query(`CREATE TABLE "UserToken" ("userTokenId" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "expiredAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_e448ad084aa849a11ac8b60495e" PRIMARY KEY ("userTokenId"))`);
        await queryRunner.query(`ALTER TABLE "PatientInsurance" ADD CONSTRAINT "FK_5e9c80d860ab95f054323c2cf2b" FOREIGN KEY ("patientId") REFERENCES "Patient"("patientId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "UserToken" ADD CONSTRAINT "FK_9d33acd97f08f9a3e86a8bd8243" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "UserToken" DROP CONSTRAINT "FK_9d33acd97f08f9a3e86a8bd8243"`);
        await queryRunner.query(`ALTER TABLE "PatientInsurance" DROP CONSTRAINT "FK_5e9c80d860ab95f054323c2cf2b"`);
        await queryRunner.query(`DROP TABLE "UserToken"`);
        await queryRunner.query(`ALTER TABLE "PatientInsurance" ADD CONSTRAINT "FK_5e9c80d860ab95f054323c2cf2b" FOREIGN KEY ("patientId") REFERENCES "Patient"("patientId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
