import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateNurseTitle1760186307242 implements MigrationInterface {
  name = 'UpdateNurseTitle1760186307242';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Nurse" ALTER COLUMN "title" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Nurse" ALTER COLUMN "title" SET NOT NULL`,
    );
  }
}
