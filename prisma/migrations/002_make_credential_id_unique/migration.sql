/*
  Warnings:

  - A unique constraint covering the columns `[credential_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_credential_id_key" ON "User"("credential_id");
