import { rm } from 'fs/promises';
import { resolve } from 'path';

const prismaClientDir = resolve(process.cwd(), 'node_modules/.prisma/client');

console.log(`Removing Prisma client artifacts at: ${prismaClientDir}`);

try {
  await rm(prismaClientDir, {
    recursive: true,
    force: true,
    maxRetries: 5,
    retryDelay: 100,
  });
} catch (error) {
  // If cleanup fails we log the error but let the build continue.
  // Prisma will attempt to overwrite the engines afterwards.
  console.warn(`Warning: could not remove ${prismaClientDir}:`, error);
}
