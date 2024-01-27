/*
  Warnings:

  - Added the required column `author_id` to the `articles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "author_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
