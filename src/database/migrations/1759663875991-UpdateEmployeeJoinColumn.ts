import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateEmployeeJoinColumn1759663875991
  implements MigrationInterface
{
  name = 'UpdateEmployeeJoinColumn1759663875991';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "DoctorSchedule" DROP CONSTRAINT "FK_4a27ab52eece53fd6baeb5978da"`,
    );
    await queryRunner.query(
      `ALTER TABLE "NurseSchedule" DROP CONSTRAINT "FK_8c93ad16e21585b4238f674c2d8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "DoctorSchedule" RENAME COLUMN "doctorDoctorId" TO "doctorId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "NurseSchedule" RENAME COLUMN "nurseNurseId" TO "nurseId"`,
    );
    await queryRunner.query(`ALTER TABLE "Doctor" ADD "employeeId" integer`);
    await queryRunner.query(
      `ALTER TABLE "Doctor" ADD CONSTRAINT "UQ_872c2af744448c72e262ab3bff6" UNIQUE ("employeeId")`,
    );
    await queryRunner.query(`ALTER TABLE "Nurse" ADD "employeeId" integer`);
    await queryRunner.query(
      `ALTER TABLE "Nurse" ADD CONSTRAINT "UQ_66fbef54b9119193f102fb61fdf" UNIQUE ("employeeId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "DoctorSchedule" ADD CONSTRAINT "FK_df0268e94d505151ab0799ccc30" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("doctorId") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Doctor" ADD CONSTRAINT "FK_872c2af744448c72e262ab3bff6" FOREIGN KEY ("employeeId") REFERENCES "Employee"("employeeId") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "NurseSchedule" ADD CONSTRAINT "FK_06a7bfe400b98e3181ff285e704" FOREIGN KEY ("nurseId") REFERENCES "Nurse"("nurseId") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Nurse" ADD CONSTRAINT "FK_66fbef54b9119193f102fb61fdf" FOREIGN KEY ("employeeId") REFERENCES "Employee"("employeeId") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Nurse" DROP CONSTRAINT "FK_66fbef54b9119193f102fb61fdf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "NurseSchedule" DROP CONSTRAINT "FK_06a7bfe400b98e3181ff285e704"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Doctor" DROP CONSTRAINT "FK_872c2af744448c72e262ab3bff6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "DoctorSchedule" DROP CONSTRAINT "FK_df0268e94d505151ab0799ccc30"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Nurse" DROP CONSTRAINT "UQ_66fbef54b9119193f102fb61fdf"`,
    );
    await queryRunner.query(`ALTER TABLE "Nurse" DROP COLUMN "employeeId"`);
    await queryRunner.query(
      `ALTER TABLE "Doctor" DROP CONSTRAINT "UQ_872c2af744448c72e262ab3bff6"`,
    );
    await queryRunner.query(`ALTER TABLE "Doctor" DROP COLUMN "employeeId"`);
    await queryRunner.query(
      `ALTER TABLE "NurseSchedule" RENAME COLUMN "nurseId" TO "nurseNurseId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "DoctorSchedule" RENAME COLUMN "doctorId" TO "doctorDoctorId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "NurseSchedule" ADD CONSTRAINT "FK_8c93ad16e21585b4238f674c2d8" FOREIGN KEY ("nurseNurseId") REFERENCES "Nurse"("nurseId") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "DoctorSchedule" ADD CONSTRAINT "FK_4a27ab52eece53fd6baeb5978da" FOREIGN KEY ("doctorDoctorId") REFERENCES "Doctor"("doctorId") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
