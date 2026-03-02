import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1709395200000 implements MigrationInterface {
    name = 'InitialSchema1709395200000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL,
                "name" character varying NOT NULL,
                "bio" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_users_email" UNIQUE ("email"),
                CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "tags" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "description" character varying,
                CONSTRAINT "UQ_tags_name" UNIQUE ("name"),
                CONSTRAINT "PK_tags_id" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "posts" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "content" text NOT NULL,
                "published" boolean NOT NULL DEFAULT false,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "authorId" uuid,
                CONSTRAINT "PK_posts_id" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "post_tags" (
                "post_id" uuid NOT NULL,
                "tag_id" uuid NOT NULL,
                CONSTRAINT "PK_post_tags" PRIMARY KEY ("post_id", "tag_id")
            )
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_post_tags_post_id" ON "post_tags" ("post_id")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_post_tags_tag_id" ON "post_tags" ("tag_id")
        `);

        await queryRunner.query(`
            ALTER TABLE "posts" 
            ADD CONSTRAINT "FK_posts_author" 
            FOREIGN KEY ("authorId") 
            REFERENCES "users"("id") 
            ON DELETE CASCADE 
            ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "post_tags" 
            ADD CONSTRAINT "FK_post_tags_post" 
            FOREIGN KEY ("post_id") 
            REFERENCES "posts"("id") 
            ON DELETE CASCADE 
            ON UPDATE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE "post_tags" 
            ADD CONSTRAINT "FK_post_tags_tag" 
            FOREIGN KEY ("tag_id") 
            REFERENCES "tags"("id") 
            ON DELETE CASCADE 
            ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_tags" DROP CONSTRAINT "FK_post_tags_tag"`);
        await queryRunner.query(`ALTER TABLE "post_tags" DROP CONSTRAINT "FK_post_tags_post"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_posts_author"`);
        await queryRunner.query(`DROP INDEX "IDX_post_tags_tag_id"`);
        await queryRunner.query(`DROP INDEX "IDX_post_tags_post_id"`);
        await queryRunner.query(`DROP TABLE "post_tags"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP TABLE "tags"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }
}
