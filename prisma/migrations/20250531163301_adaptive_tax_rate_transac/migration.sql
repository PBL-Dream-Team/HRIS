/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `LetterType` table. All the data in the column will be lost.
  - You are about to drop the column `is_deleted` on the `LetterType` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AbsenceLeave" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Attendance" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "AttendanceType" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Letter" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "LetterType" DROP COLUMN "deleted_at",
DROP COLUMN "is_deleted",
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Subscription" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "taxRate" DECIMAL(5,2) NOT NULL DEFAULT 10.00,
ALTER COLUMN "updated_at" DROP DEFAULT;
