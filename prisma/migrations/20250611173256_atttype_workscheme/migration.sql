-- AlterTable
ALTER TABLE "AttendanceType" ADD COLUMN     "workscheme" "WorkSchemeType";

-- AlterTable
ALTER TABLE "Letter" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;
