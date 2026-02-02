import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAppointment1760287041872 implements MigrationInterface {
  name = 'AddAppointment1760287041872';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."Appointment_status_enum" AS ENUM('incompleted', 'completed', 'cancelled')`,
    );
    await queryRunner.query(
      `CREATE TABLE "Appointment" ("appointmentId" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."Appointment_status_enum" NOT NULL DEFAULT 'incompleted', "date" TIMESTAMP NOT NULL, "concern" text NOT NULL, "diagnosis" text, "patientId" integer, "doctorId" uuid, CONSTRAINT "PK_f61e1b0a28820f2584893977829" PRIMARY KEY ("appointmentId"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "Appointment" ADD CONSTRAINT "FK_ceca0c75fde8f7ec420063d1475" FOREIGN KEY ("patientId") REFERENCES "Patient"("patientId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Appointment" ADD CONSTRAINT "FK_f86425360509a0ead679c17b3eb" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("doctorId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Appointment" DROP CONSTRAINT "FK_f86425360509a0ead679c17b3eb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Appointment" DROP CONSTRAINT "FK_ceca0c75fde8f7ec420063d1475"`,
    );
    await queryRunner.query(`DROP TABLE "Appointment"`);
    await queryRunner.query(`DROP TYPE "public"."Appointment_status_enum"`);
  }
}
