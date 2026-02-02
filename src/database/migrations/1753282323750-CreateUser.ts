import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUser1753282323750 implements MigrationInterface {
  name = 'CreateUser1753282323750';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."User_gender_enum" AS ENUM('male', 'female')`,
    );
    await queryRunner.query(
      `CREATE TABLE "User" ("userId" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(100) NOT NULL, "userName" character varying(25) NOT NULL, "password" character varying(16) NOT NULL, "firstName" character varying(25) NOT NULL, "lastName" character varying(25) NOT NULL, "gender" "public"."User_gender_enum" NOT NULL, "phoneNumber" character varying NOT NULL, "dateOfBirth" date NOT NULL, "address" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_4a257d2c9837248d70640b3e36e" UNIQUE ("email"), CONSTRAINT "UQ_58ca35d90f5ca194db65d775889" UNIQUE ("userName"), CONSTRAINT "PK_45f0625bd8172eb9c821c948a0f" PRIMARY KEY ("userId"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "User"`);
    await queryRunner.query(`DROP TYPE "public"."User_gender_enum"`);
  }
}
