import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateHashPasswordUser1754295848142 implements MigrationInterface {
  name = 'UpdateHashPasswordUser1754295848142';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."User_role_enum" AS ENUM('admin', 'user')`,
    );
    await queryRunner.query(
      `ALTER TABLE "User" ADD "role" "public"."User_role_enum" NOT NULL DEFAULT 'user'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "User" DROP COLUMN "role"`);
    await queryRunner.query(`DROP TYPE "public"."User_role_enum"`);
  }
}
