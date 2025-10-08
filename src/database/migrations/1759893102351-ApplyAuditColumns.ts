import { MigrationInterface, QueryRunner } from "typeorm";

export class ApplyAuditColumns1759893102351 implements MigrationInterface {
    name = 'ApplyAuditColumns1759893102351'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "DoctorSchedule" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "DoctorSchedule" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "DoctorSchedule" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "Doctor" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "Doctor" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "Doctor" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "NurseSchedule" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "NurseSchedule" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "NurseSchedule" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "Nurse" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "Nurse" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "Nurse" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "Employee" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "Employee" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "Employee" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "UserToken" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "UserToken" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "User" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "PatientInsurance" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "PatientInsurance" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "PatientInsurance" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "Patient" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "Patient" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "Patient" ADD "deletedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Patient" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "Patient" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "Patient" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "PatientInsurance" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "PatientInsurance" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "PatientInsurance" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "User" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "UserToken" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "UserToken" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "Employee" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "Employee" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "Employee" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "Nurse" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "Nurse" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "Nurse" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "NurseSchedule" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "NurseSchedule" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "NurseSchedule" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "Doctor" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "Doctor" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "Doctor" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "DoctorSchedule" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "DoctorSchedule" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "DoctorSchedule" DROP COLUMN "createdAt"`);
    }

}
