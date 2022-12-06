import { MigrationInterface, QueryRunner } from "typeorm";

export class taskUserPermission1670350756607 implements MigrationInterface {
    name = 'taskUserPermission1670350756607'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_permissions_enum" AS ENUM('ADMIN', 'USER')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "permissions" "public"."user_permissions_enum" NOT NULL DEFAULT 'USER'`);
        await queryRunner.query(`ALTER TABLE "task" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9"`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "permissions"`);
        await queryRunner.query(`DROP TYPE "public"."user_permissions_enum"`);
    }

}
