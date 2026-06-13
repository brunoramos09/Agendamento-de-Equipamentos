-- DropForeignKey
ALTER TABLE "Maintenance" DROP CONSTRAINT "Maintenance_equipmentId_fkey";

-- AddForeignKey
ALTER TABLE "Maintenance" ADD CONSTRAINT "Maintenance_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
