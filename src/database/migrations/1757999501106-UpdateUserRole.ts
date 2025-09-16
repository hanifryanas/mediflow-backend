import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserRole1757999501106 implements MigrationInterface {
    name = 'UpdateUserRole1757999501106'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."User_role_enum" RENAME TO "User_role_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."User_role_enum" AS ENUM('user', 'staff', 'admin', 'superadmin')`);
        await queryRunner.query(`ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "User" ALTER COLUMN "role" TYPE "public"."User_role_enum" USING "role"::"text"::"public"."User_role_enum"`);
        await queryRunner.query(`ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'user'`);
        await queryRunner.query(`DROP TYPE "public"."User_role_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."User_role_enum_old" AS ENUM('admin', 'user')`);
        await queryRunner.query(`ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "User" ALTER COLUMN "role" TYPE "public"."User_role_enum_old" USING "role"::"text"::"public"."User_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'user'`);
        await queryRunner.query(`DROP TYPE "public"."User_role_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."User_role_enum_old" RENAME TO "User_role_enum"`);
    }

}
