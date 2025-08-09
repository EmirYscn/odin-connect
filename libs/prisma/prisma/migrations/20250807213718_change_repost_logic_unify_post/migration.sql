/*
  Warnings:

  - You are about to drop the `Repost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Repost" DROP CONSTRAINT "Repost_postId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Repost" DROP CONSTRAINT "Repost_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Post" ADD COLUMN     "repostOfId" TEXT,
ALTER COLUMN "content" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."Repost";

-- AddForeignKey
ALTER TABLE "public"."Post" ADD CONSTRAINT "Post_repostOfId_fkey" FOREIGN KEY ("repostOfId") REFERENCES "public"."Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
