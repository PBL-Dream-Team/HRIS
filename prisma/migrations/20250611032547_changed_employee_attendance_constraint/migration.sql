-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_subscription_id_fkey";

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_attendance_id_fkey";

-- AlterTable
ALTER TABLE "Letter" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_attendance_id_fkey" FOREIGN KEY ("attendance_id") REFERENCES "AttendanceType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
