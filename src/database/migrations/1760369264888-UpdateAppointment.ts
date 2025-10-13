import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAppointment1760369264888 implements MigrationInterface {
    name = 'UpdateAppointment1760369264888'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Appointment" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "Appointment" ADD "startTime" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Appointment" ADD "endTime" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Appointment" ADD "notes" text`);
        await queryRunner.query(`ALTER TABLE "Appointment" ADD "room" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Appointment" DROP COLUMN "room"`);
        await queryRunner.query(`ALTER TABLE "Appointment" DROP COLUMN "notes"`);
        await queryRunner.query(`ALTER TABLE "Appointment" DROP COLUMN "endTime"`);
        await queryRunner.query(`ALTER TABLE "Appointment" DROP COLUMN "startTime"`);
        await queryRunner.query(`ALTER TABLE "Appointment" ADD "date" TIMESTAMP NOT NULL`);
    }

}
