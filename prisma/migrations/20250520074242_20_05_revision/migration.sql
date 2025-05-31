/*
  Warnings:

  - You are about to drop the column `workpict_dir` on the `Attendance` table. All the data in the column will be lost.
  - Added the required column `absencepict` to the `AbsenceLeave` table without a default value. This is not possible if the table is not empty.
  - Added the required column `check_in_address` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type_id` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ContractType" AS ENUM ('PERMANENT', 'CONTRACT', 'INTERN');

-- AlterTable
ALTER TABLE "AbsenceLeave" ADD COLUMN     "absencepict" TEXT NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "workpict_dir",
ADD COLUMN     "check_in_address" VARCHAR NOT NULL,
ADD COLUMN     "check_out_address" VARCHAR,
ADD COLUMN     "type_id" UUID NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "AttendanceType" ADD COLUMN     "workspace_address" VARCHAR,
ADD COLUMN     "workspace_lat" DOUBLE PRECISION,
ADD COLUMN     "workspace_long" DOUBLE PRECISION,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "account_bank" VARCHAR,
ADD COLUMN     "account_name" VARCHAR,
ADD COLUMN     "account_number" VARCHAR,
ADD COLUMN     "contract" "ContractType",
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Letter" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "LetterType" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Subscription" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "AttendanceType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
