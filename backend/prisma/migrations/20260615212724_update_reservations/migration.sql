-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "hadIssue" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "returnObservations" TEXT;
