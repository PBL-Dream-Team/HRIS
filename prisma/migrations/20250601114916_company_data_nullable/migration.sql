-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_subscription_id_fkey";

-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "subscription_id" DROP NOT NULL,
ALTER COLUMN "max_employee" DROP NOT NULL,
ALTER COLUMN "subs_date_start" DROP NOT NULL,
ALTER COLUMN "subs_date_end" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Letter" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;
