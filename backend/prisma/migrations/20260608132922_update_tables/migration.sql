/*
  Warnings:

  - You are about to drop the column `description` on the `Equipment` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Equipment` table. All the data in the column will be lost.
  - You are about to drop the column `equipmentId` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `requester` on the `Reservation` table. All the data in the column will be lost.
  - Added the required column `user` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EquipmentStatus" AS ENUM ('DISPONIVEL', 'MANUTENCAO', 'INATIVO');

-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_equipmentId_fkey";

-- AlterTable
ALTER TABLE "Equipment" DROP COLUMN "description",
DROP COLUMN "notes",
ADD COLUMN     "attachedDocuments" TEXT[],
ADD COLUMN     "instructions" TEXT,
ADD COLUMN     "observations" TEXT,
ADD COLUMN     "photo" TEXT,
ADD COLUMN     "responsibleEmployee" TEXT,
ADD COLUMN     "serialNumber" TEXT,
ADD COLUMN     "status" "EquipmentStatus" NOT NULL DEFAULT 'DISPONIVEL',
ADD COLUMN     "subdivisions" INTEGER;

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "equipmentId",
DROP COLUMN "notes",
DROP COLUMN "requester",
ADD COLUMN     "observations" TEXT,
ADD COLUMN     "returnedAt" TIMESTAMP(3),
ADD COLUMN     "user" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ReservationEquipment" (
    "id" SERIAL NOT NULL,
    "reservationId" INTEGER NOT NULL,
    "equipmentId" INTEGER NOT NULL,
    "subdivisionsQuantity" INTEGER,

    CONSTRAINT "ReservationEquipment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReservationEquipment_reservationId_equipmentId_key" ON "ReservationEquipment"("reservationId", "equipmentId");

-- AddForeignKey
ALTER TABLE "ReservationEquipment" ADD CONSTRAINT "ReservationEquipment_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservationEquipment" ADD CONSTRAINT "ReservationEquipment_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
