import {neon} from '@neondatabase/serverless'
import { PrismaClient } from '@prisma/client';

// Singleton pattern to prevent multiple Prisma instances
const globalForPrisma = global;

const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['error', 'warn'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;