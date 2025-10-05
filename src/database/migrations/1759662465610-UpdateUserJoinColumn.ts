import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserJoinColumn1759662465610 implements MigrationInterface {
    name = 'UpdateUserJoinColumn1759662465610'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Employee" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "Employee" ADD CONSTRAINT "UQ_c1ec0cb63387d4c8bb2892bc002" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "Employee" ADD CONSTRAINT "FK_c1ec0cb63387d4c8bb2892bc002" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Employee" DROP CONSTRAINT "FK_c1ec0cb63387d4c8bb2892bc002"`);
        await queryRunner.query(`ALTER TABLE "Employee" DROP CONSTRAINT "UQ_c1ec0cb63387d4c8bb2892bc002"`);
        await queryRunner.query(`ALTER TABLE "Employee" DROP COLUMN "userId"`);
    }

}
