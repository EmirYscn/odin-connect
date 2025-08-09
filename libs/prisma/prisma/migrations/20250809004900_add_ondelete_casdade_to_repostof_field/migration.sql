-- DropForeignKey
ALTER TABLE "public"."Post" DROP CONSTRAINT "Post_repostOfId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Post" ADD CONSTRAINT "Post_repostOfId_fkey" FOREIGN KEY ("repostOfId") REFERENCES "public"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
