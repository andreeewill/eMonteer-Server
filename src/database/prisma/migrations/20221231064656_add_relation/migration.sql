/*
  Warnings:

  - A unique constraint covering the columns `[user_detail_id]` on the table `Garage` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[chat_id]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "mechanic_id" TEXT,
ADD COLUMN     "user_id" TEXT;

-- AlterTable
ALTER TABLE "CostList" ADD COLUMN     "order_id" TEXT;

-- AlterTable
ALTER TABLE "Garage" ADD COLUMN     "user_detail_id" TEXT,
ALTER COLUMN "is_available" SET DEFAULT true;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "chat_id" TEXT;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "chat_id" TEXT,
ADD COLUMN     "garage_Id" TEXT,
ADD COLUMN     "mechanic_id" TEXT,
ADD COLUMN     "towing_id" TEXT,
ADD COLUMN     "user_id" TEXT;

-- AlterTable
ALTER TABLE "UserDetail" ADD COLUMN     "is_available" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "Garage_user_detail_id_key" ON "Garage"("user_detail_id");

-- CreateIndex
CREATE UNIQUE INDEX "Order_chat_id_key" ON "Order"("chat_id");

-- AddForeignKey
ALTER TABLE "Garage" ADD CONSTRAINT "Garage_user_detail_id_fkey" FOREIGN KEY ("user_detail_id") REFERENCES "UserDetail"("vendor_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_mechanic_id_fkey" FOREIGN KEY ("mechanic_id") REFERENCES "UserDetail"("vendor_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "Chat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostList" ADD CONSTRAINT "CostList_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_mechanic_id_fkey" FOREIGN KEY ("mechanic_id") REFERENCES "UserDetail"("vendor_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_garage_Id_fkey" FOREIGN KEY ("garage_Id") REFERENCES "Garage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "Chat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_towing_id_fkey" FOREIGN KEY ("towing_id") REFERENCES "Towing"("id") ON DELETE SET NULL ON UPDATE CASCADE;
