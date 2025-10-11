import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDoctorTitle1760162463002 implements MigrationInterface {
    name = 'UpdateDoctorTitle1760162463002'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Doctor" ALTER COLUMN "title" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Doctor" ALTER COLUMN "title" SET NOT NULL`);
    }

}
