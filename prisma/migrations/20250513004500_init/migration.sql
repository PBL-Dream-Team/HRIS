-- CreateEnum
CREATE TYPE "SubscriptionType" AS ENUM ('TRIAL', 'PAID');

-- CreateEnum
CREATE TYPE "CompanySubscriptionStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "WorkSchemeType" AS ENUM ('WFA', 'WFO', 'HYBRID');

-- CreateEnum
CREATE TYPE "EducationType" AS ENUM ('HIGH_SCHOOL', 'BACHELOR', 'MASTER', 'DOCTOR');

-- CreateEnum
CREATE TYPE "CheckInStatus" AS ENUM ('ON_TIME', 'LATE');

-- CreateEnum
CREATE TYPE "CheckOutStatus" AS ENUM ('ON_TIME', 'EARLY');

-- CreateEnum
CREATE TYPE "leaveStatus" AS ENUM ('APPROVED', 'REJECTED', 'PENDING');

-- CreateTable
CREATE TABLE "Subscription" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "desc" TEXT,
    "max_employee" INTEGER NOT NULL,
    "price_per_employee" INTEGER NOT NULL,
    "type" "SubscriptionType" NOT NULL,
    "day_length" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "address" VARCHAR(100) NOT NULL,
    "loc_lat" DOUBLE PRECISION NOT NULL,
    "loc_long" DOUBLE PRECISION NOT NULL,
    "subscription_id" UUID NOT NULL,
    "max_employee" INTEGER NOT NULL,
    "subs_date_start" TIMESTAMPTZ NOT NULL,
    "subs_date_end" TIMESTAMPTZ NOT NULL,
    "status" "CompanySubscriptionStatus" NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "workscheme" "WorkSchemeType",
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "gender" CHAR(1),
    "address" TEXT,
    "email" VARCHAR(100) NOT NULL,
    "password" TEXT NOT NULL,
    "phone" VARCHAR(100),
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "attendance_id" UUID,
    "birth_date" DATE,
    "birth_place" VARCHAR(50),
    "nik" VARCHAR(16),
    "position" VARCHAR(50),
    "branch" VARCHAR(50),
    "last_education" "EducationType",
    "pict_dir" TEXT,
    "google_id" VARCHAR(100),
    "access_token" TEXT,
    "refresh_token" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LetterType" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "content" TEXT,
    "company_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "LetterType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Letter" (
    "id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "lettertype_id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "desc" TEXT,
    "file_dir" TEXT,
    "valid_until" DATE NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Letter_pkey" PRIMARY KEY ("id")
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
    "check_out" TIME,
    "check_out_status" "CheckInStatus",
    "check_out_long" DOUBLE PRECISION,
    "check_out_lat" DOUBLE PRECISION,
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
    "company_id" UUID NOT NULL,
    "reason" TEXT,
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "leaveStatus" NOT NULL DEFAULT 'PENDING',
    "status_change_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AbsenceLeave_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_nik_key" ON "Employee"("nik");

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
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_attendance_id_fkey" FOREIGN KEY ("attendance_id") REFERENCES "AttendanceType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LetterType" ADD CONSTRAINT "LetterType_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Letter" ADD CONSTRAINT "Letter_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Letter" ADD CONSTRAINT "Letter_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "AbsenceLeave" ADD CONSTRAINT "AbsenceLeave_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
