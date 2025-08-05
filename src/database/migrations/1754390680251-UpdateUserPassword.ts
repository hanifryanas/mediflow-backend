import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserPassword1754390680251 implements MigrationInterface {
    name = 'UpdateUserPassword1754390680251'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "User" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "User" ADD "password" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "User" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "User" ADD "password" character varying(16) NOT NULL`);
    }

}
