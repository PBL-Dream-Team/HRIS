/*
  Warnings:

  - The values [Active,Inactive] on the enum `CompanySubscriptionStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [Bachelor,Master,Doctor] on the enum `EducationType` will be removed. If these variants are still used in the database, this will fail.
  - The values [Trial,Paid] on the enum `SubscriptionType` will be removed. If these variants are still used in the database, this will fail.
  - The values [Hybrid] on the enum `WorkSchemeType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `address` on the `Company` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CompanySubscriptionStatus_new" AS ENUM ('ACTIVE', 'INACTIVE');
ALTER TABLE "Company" ALTER COLUMN "status" TYPE "CompanySubscriptionStatus_new" USING ("status"::text::"CompanySubscriptionStatus_new");
ALTER TYPE "CompanySubscriptionStatus" RENAME TO "CompanySubscriptionStatus_old";
ALTER TYPE "CompanySubscriptionStatus_new" RENAME TO "CompanySubscriptionStatus";
DROP TYPE "CompanySubscriptionStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "EducationType_new" AS ENUM ('HIGH_SCHOOL', 'BACHELOR', 'MASTER', 'DOCTOR');
ALTER TABLE "Employee" ALTER COLUMN "last_education" TYPE "EducationType_new" USING ("last_education"::text::"EducationType_new");
ALTER TYPE "EducationType" RENAME TO "EducationType_old";
ALTER TYPE "EducationType_new" RENAME TO "EducationType";
DROP TYPE "EducationType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "SubscriptionType_new" AS ENUM ('TRIAL', 'PAID');
ALTER TABLE "Subscription" ALTER COLUMN "type" TYPE "SubscriptionType_new" USING ("type"::text::"SubscriptionType_new");
ALTER TYPE "SubscriptionType" RENAME TO "SubscriptionType_old";
ALTER TYPE "SubscriptionType_new" RENAME TO "SubscriptionType";
DROP TYPE "SubscriptionType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "WorkSchemeType_new" AS ENUM ('WFA', 'WFO', 'HYBRID');
ALTER TABLE "Employee" ALTER COLUMN "workscheme" TYPE "WorkSchemeType_new" USING ("workscheme"::text::"WorkSchemeType_new");
ALTER TYPE "WorkSchemeType" RENAME TO "WorkSchemeType_old";
ALTER TYPE "WorkSchemeType_new" RENAME TO "WorkSchemeType";
DROP TYPE "WorkSchemeType_old";
COMMIT;

-- AlterTable
ALTER TABLE "AbsenceLeave" ALTER COLUMN "status" SET DEFAULT 'PENDING',
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Attendance" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "AttendanceType" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "address" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "attendance_id" DROP NOT NULL,
ALTER COLUMN "gender" DROP NOT NULL,
ALTER COLUMN "last_education" DROP NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "pict_dir" DROP NOT NULL,
ALTER COLUMN "workscheme" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Letter" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "LetterType" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Subscription" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_attendance_id_fkey" FOREIGN KEY ("attendance_id") REFERENCES "AttendanceType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
