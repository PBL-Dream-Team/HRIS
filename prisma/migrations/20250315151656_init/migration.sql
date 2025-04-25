-- CreateEnum
CREATE TYPE "SalaryType" AS ENUM ('HOURLY', 'WEEKLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "SubscriptionType" AS ENUM ('Trial', 'Paid');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('Active', 'Expired', 'Canceled');

-- CreateEnum
CREATE TYPE "CheckClockType" AS ENUM ('START', 'END');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" TEXT NOT NULL,
    "phone" VARCHAR(100) NOT NULL,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "gender" CHAR(1) NOT NULL,
    "address" TEXT,
    "google_id" VARCHAR(100),
    "access_token" TEXT,
    "refresh_token" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,
    "ck_time_id" UUID NOT NULL,
    "joined_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_hr" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Salary" (
    "id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "type" "SalaryType" NOT NULL DEFAULT 'MONTHLY',
    "rate" REAL NOT NULL,
    "effective_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Salary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workspace" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" "SubscriptionType" NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "start_date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_date" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "xendit_transaction_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LetterFormat" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "content" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "LetterFormat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Letter" (
    "id" UUID NOT NULL,
    "letter_format_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Letter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckClocks" (
    "id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "check_clock_type" "CheckClockType" NOT NULL,
    "check_clock_time" TIME NOT NULL DEFAULT NOW(),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CheckClocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckClocksSetting" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "type" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CheckClocksSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckClocksSettingTime" (
    "id" UUID NOT NULL,
    "ck_settings_id" UUID NOT NULL,
    "day" DATE NOT NULL,
    "clock_in" TIME NOT NULL,
    "clock_out" TIME NOT NULL,
    "break_start" TIME NOT NULL,
    "break_end" TIME NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CheckClocksSettingTime_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_google_id_key" ON "User"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_access_token_key" ON "User"("access_token");

-- CreateIndex
CREATE UNIQUE INDEX "User_refresh_token_key" ON "User"("refresh_token");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_id_key" ON "Employee"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Salary_id_key" ON "Salary"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_id_key" ON "Workspace"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_id_key" ON "Subscription"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_id_key" ON "Payment"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_xendit_transaction_id_key" ON "Payment"("xendit_transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "LetterFormat_id_key" ON "LetterFormat"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Letter_id_key" ON "Letter"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CheckClocks_id_key" ON "CheckClocks"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CheckClocksSetting_id_key" ON "CheckClocksSetting"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CheckClocksSettingTime_id_key" ON "CheckClocksSettingTime"("id");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_ck_time_id_fkey" FOREIGN KEY ("ck_time_id") REFERENCES "CheckClocksSettingTime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Salary" ADD CONSTRAINT "Salary_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Letter" ADD CONSTRAINT "Letter_letter_format_id_fkey" FOREIGN KEY ("letter_format_id") REFERENCES "LetterFormat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Letter" ADD CONSTRAINT "Letter_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckClocks" ADD CONSTRAINT "CheckClocks_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckClocksSettingTime" ADD CONSTRAINT "CheckClocksSettingTime_ck_settings_id_fkey" FOREIGN KEY ("ck_settings_id") REFERENCES "CheckClocksSetting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
