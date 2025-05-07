/*
  Warnings:

  - You are about to drop the column `ck_time_id` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `is_hr` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `joined_at` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `workspace_id` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `letter_format_id` on the `Letter` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `Letter` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(50)`.
  - You are about to drop the column `start_date` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `update_date` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `workspace_id` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the `CheckClocks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CheckClocksSetting` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CheckClocksSettingTime` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LetterFormat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Salary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Workspace` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[google_id]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[access_token]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[refresh_token]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `attendance_id` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_id` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_education` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pict_dir` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workscheme` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_id` to the `Letter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `desc` to the `Letter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `file_dir` to the `Letter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lettertype_id` to the `Letter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valid_until` to the `Letter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `day_length` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `desc` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `max_employee` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price_per_employee` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CompanySubscriptionStatus" AS ENUM ('Active', 'Inactive');

-- CreateEnum
CREATE TYPE "WorkSchemeType" AS ENUM ('WFA', 'WFO', 'Hybrid');

-- CreateEnum
CREATE TYPE "EducationType" AS ENUM ('Bachelor', 'Master', 'Doctor');

-- CreateEnum
CREATE TYPE "CheckInStatus" AS ENUM ('ON_TIME', 'LATE');

-- CreateEnum
CREATE TYPE "CheckOutStatus" AS ENUM ('ON_TIME', 'EARLY');

-- CreateEnum
CREATE TYPE "leaveStatus" AS ENUM ('APPROVED', 'REJECTED', 'PENDING');

-- DropForeignKey
ALTER TABLE "CheckClocks" DROP CONSTRAINT "CheckClocks_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "CheckClocksSettingTime" DROP CONSTRAINT "CheckClocksSettingTime_ck_settings_id_fkey";

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_ck_time_id_fkey";

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_workspace_id_fkey";

-- DropForeignKey
ALTER TABLE "Letter" DROP CONSTRAINT "Letter_letter_format_id_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Salary" DROP CONSTRAINT "Salary_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_workspace_id_fkey";

-- DropForeignKey
ALTER TABLE "Workspace" DROP CONSTRAINT "Workspace_created_by_fkey";

-- DropIndex
DROP INDEX "Employee_id_key";

-- DropIndex
DROP INDEX "Letter_id_key";

-- DropIndex
DROP INDEX "Subscription_id_key";

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "ck_time_id",
DROP COLUMN "is_hr",
DROP COLUMN "joined_at",
DROP COLUMN "user_id",
DROP COLUMN "workspace_id",
ADD COLUMN     "access_token" TEXT,
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "attendance_id" UUID NOT NULL,
ADD COLUMN     "birth_date" DATE,
ADD COLUMN     "birth_place" VARCHAR(50),
ADD COLUMN     "branch" VARCHAR(50),
ADD COLUMN     "company_id" UUID NOT NULL,
ADD COLUMN     "email" VARCHAR(100) NOT NULL,
ADD COLUMN     "first_name" VARCHAR(100) NOT NULL,
ADD COLUMN     "gender" CHAR(1) NOT NULL,
ADD COLUMN     "google_id" VARCHAR(100),
ADD COLUMN     "is_admin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_education" "EducationType" NOT NULL,
ADD COLUMN     "last_name" VARCHAR(100) NOT NULL,
ADD COLUMN     "nik" VARCHAR(16),
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "phone" VARCHAR(100) NOT NULL,
ADD COLUMN     "pict_dir" TEXT NOT NULL,
ADD COLUMN     "position" VARCHAR(50),
ADD COLUMN     "refresh_token" TEXT,
ADD COLUMN     "workscheme" "WorkSchemeType" NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Letter" DROP COLUMN "letter_format_id",
ADD COLUMN     "company_id" UUID NOT NULL,
ADD COLUMN     "desc" TEXT NOT NULL,
ADD COLUMN     "file_dir" TEXT NOT NULL,
ADD COLUMN     "lettertype_id" UUID NOT NULL,
ADD COLUMN     "valid_until" DATE NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "start_date",
DROP COLUMN "status",
DROP COLUMN "update_date",
DROP COLUMN "user_id",
DROP COLUMN "workspace_id",
ADD COLUMN     "day_length" INTEGER NOT NULL,
ADD COLUMN     "desc" TEXT NOT NULL,
ADD COLUMN     "max_employee" INTEGER NOT NULL,
ADD COLUMN     "name" VARCHAR(50) NOT NULL,
ADD COLUMN     "price_per_employee" INTEGER NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "CheckClocks";

-- DropTable
DROP TABLE "CheckClocksSetting";

-- DropTable
DROP TABLE "CheckClocksSettingTime";

-- DropTable
DROP TABLE "LetterFormat";

-- DropTable
DROP TABLE "Payment";

-- DropTable
DROP TABLE "Salary";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "Workspace";

-- DropEnum
DROP TYPE "CheckClockType";

-- DropEnum
DROP TYPE "SalaryType";

-- DropEnum
DROP TYPE "SubscriptionStatus";

-- CreateTable
CREATE TABLE "Company" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "address" TEXT NOT NULL,
    "loc_lat" DOUBLE PRECISION NOT NULL,
    "loc_long" DOUBLE PRECISION NOT NULL,
    "subscription_id" UUID NOT NULL,
    "max_employee" INTEGER NOT NULL,
    "subs_date_start" TIMESTAMP NOT NULL,
    "subs_date_end" TIMESTAMP NOT NULL,
    "status" "CompanySubscriptionStatus" NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LetterType" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "content" TEXT NOT NULL,
    "company_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "LetterType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceType" (
    "id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "check_in" TIME NOT NULL,
    "check_out" TIME NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AttendanceType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "check_in" TIME NOT NULL,
    "check_in_status" "CheckInStatus" NOT NULL,
    "check_in_long" DOUBLE PRECISION NOT NULL,
    "check_in_lat" DOUBLE PRECISION NOT NULL,
    "check_out" TIME NOT NULL,
    "check_out_status" "CheckInStatus" NOT NULL,
    "check_out_long" DOUBLE PRECISION NOT NULL,
    "check_out_lat" DOUBLE PRECISION NOT NULL,
    "workpict_dir" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AbsenceLeave" (
    "id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "reason" TEXT NOT NULL,
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "leaveStatus" NOT NULL,
    "status_change_at" TIMESTAMP NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AbsenceLeave_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_google_id_key" ON "Employee"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_access_token_key" ON "Employee"("access_token");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_refresh_token_key" ON "Employee"("refresh_token");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "Subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LetterType" ADD CONSTRAINT "LetterType_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Letter" ADD CONSTRAINT "Letter_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Letter" ADD CONSTRAINT "Letter_lettertype_id_fkey" FOREIGN KEY ("lettertype_id") REFERENCES "LetterType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceType" ADD CONSTRAINT "AttendanceType_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AbsenceLeave" ADD CONSTRAINT "AbsenceLeave_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
