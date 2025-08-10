/*
  Warnings:

  - The values [COMMENT] on the enum `NOTIFICATION_TYPE` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."NOTIFICATION_TYPE_new" AS ENUM ('LIKE', 'REPLY', 'FOLLOW', 'REPOST');
ALTER TABLE "public"."Notification" ALTER COLUMN "type" TYPE "public"."NOTIFICATION_TYPE_new" USING ("type"::text::"public"."NOTIFICATION_TYPE_new");
ALTER TYPE "public"."NOTIFICATION_TYPE" RENAME TO "NOTIFICATION_TYPE_old";
ALTER TYPE "public"."NOTIFICATION_TYPE_new" RENAME TO "NOTIFICATION_TYPE";
DROP TYPE "public"."NOTIFICATION_TYPE_old";
COMMIT;
