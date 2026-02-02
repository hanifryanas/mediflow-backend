import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserTokenType1754309106266 implements MigrationInterface {
  name = 'AddUserTokenType1754309106266';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."UserToken_type_enum" AS ENUM('refreshtoken', 'confirmemail', 'resetpassword')`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserToken" ADD "type" "public"."UserToken_type_enum" NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "UserToken" DROP COLUMN "type"`);
    await queryRunner.query(`DROP TYPE "public"."UserToken_type_enum"`);
  }
}
