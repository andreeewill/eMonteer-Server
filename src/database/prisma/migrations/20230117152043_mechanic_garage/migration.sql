-- AlterTable
ALTER TABLE "UserDetail" ADD COLUMN     "mechanic_garage_id" TEXT;

-- AddForeignKey
ALTER TABLE "UserDetail" ADD CONSTRAINT "UserDetail_mechanic_garage_id_fkey" FOREIGN KEY ("mechanic_garage_id") REFERENCES "Garage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
