import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEmployeeDepartment1758940805000 implements MigrationInterface {
    name = 'UpdateEmployeeDepartment1758940805000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."Employee_department_enum" RENAME TO "Employee_department_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."Employee_department_enum" AS ENUM('frontoffice', 'backoffice', 'obgyn', 'pediatric', 'ent', 'surgery', 'radiology', 'cardiology', 'neurology', 'orthopedics', 'urology', 'ophthalmology', 'emergencydepartment', 'pharmacy', 'icu', 'inpatient')`);
        await queryRunner.query(`ALTER TABLE "Employee" ALTER COLUMN "department" TYPE "public"."Employee_department_enum" USING "department"::"text"::"public"."Employee_department_enum"`);
        await queryRunner.query(`DROP TYPE "public"."Employee_department_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."Employee_department_enum_old" AS ENUM('FrontOffice', 'BackOffice', 'Obgyn', 'Pediatric', 'ENT', 'Surgery', 'Radiology', 'Cardiology', 'Neurology', 'Orthopedics', 'Urology', 'Ophthalmology', 'EmergencyDepartment', 'Pharmacy', 'ICU', 'Inpatient')`);
        await queryRunner.query(`ALTER TABLE "Employee" ALTER COLUMN "department" TYPE "public"."Employee_department_enum_old" USING "department"::"text"::"public"."Employee_department_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."Employee_department_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."Employee_department_enum_old" RENAME TO "Employee_department_enum"`);
    }

}
