/*
  Warnings:

  - You are about to drop the column `user_detail_id` on the `Garage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[owner_id]` on the table `Garage` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Garage" DROP CONSTRAINT "Garage_user_detail_id_fkey";

-- DropIndex
DROP INDEX "Garage_user_detail_id_key";

-- AlterTable
ALTER TABLE "Garage" DROP COLUMN "user_detail_id",
ADD COLUMN     "owner_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Garage_owner_id_key" ON "Garage"("owner_id");

-- AddForeignKey
ALTER TABLE "Garage" ADD CONSTRAINT "Garage_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "UserDetail"("vendor_id") ON DELETE SET NULL ON UPDATE CASCADE;
