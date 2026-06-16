-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('ATIVA', 'PENDENTE_APROVACAO', 'REJEITADA');

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "status" "ReservationStatus" NOT NULL DEFAULT 'ATIVA';
