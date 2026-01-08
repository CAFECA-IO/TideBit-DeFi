-- DropIndex
DROP INDEX "Company_address_idx";

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "country" TEXT,
ADD COLUMN     "currentStep" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "doc_id_file" TEXT,
ADD COLUMN     "doc_id_type" TEXT,
ADD COLUMN     "doc_reg_file" TEXT,
ADD COLUMN     "doc_ubo_file" TEXT,
ADD COLUMN     "key_contact_person" TEXT,
ADD COLUMN     "legal_structure" TEXT,
ADD COLUMN     "registration_date" TIMESTAMP(3),
ADD COLUMN     "registration_number" TEXT,
ADD COLUMN     "representative_name" TEXT,
ADD COLUMN     "token_logo_id" TEXT,
ADD COLUMN     "token_name" TEXT,
ADD COLUMN     "token_symbol" TEXT,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "threshold" DROP NOT NULL,
ALTER COLUMN "salt" DROP NOT NULL;
