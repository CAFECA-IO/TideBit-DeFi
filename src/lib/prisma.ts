import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
// eslint-disable-next-line no-restricted-imports
import { PrismaClient } from '../../generated/prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
