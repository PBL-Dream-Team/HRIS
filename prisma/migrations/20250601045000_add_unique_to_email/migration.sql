/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Letter" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_phone_key" ON "Employee"("phone");
