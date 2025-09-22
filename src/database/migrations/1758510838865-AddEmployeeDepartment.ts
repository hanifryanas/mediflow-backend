import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmployeeDepartment1758510838865 implements MigrationInterface {
    name = 'AddEmployeeDepartment1758510838865'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."Employee_department_enum" AS ENUM('FrontOffice', 'BackOffice', 'Obgyn', 'Pediatric', 'ENT', 'Surgery', 'Radiology', 'Cardiology', 'Neurology', 'Orthopedics', 'Urology', 'Ophthalmology', 'EmergencyDepartment', 'Pharmacy', 'ICU', 'Inpatient')`);
        await queryRunner.query(`ALTER TABLE "Employee" ADD "department" "public"."Employee_department_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Employee" DROP COLUMN "department"`);
        await queryRunner.query(`DROP TYPE "public"."Employee_department_enum"`);
    }

}
