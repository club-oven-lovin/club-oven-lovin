import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Checking for locks on 72707369...');
    try {
        // Check pg_locks for pids holding or waiting for this lock
        const locks: any[] = await prisma.$queryRaw`
      SELECT pid, mode, granted 
      FROM pg_locks 
      WHERE objid = 72707369;
    `;
        console.log('Locks found:', locks);

        if (locks.length > 0) {
            for (const lock of locks) {
                console.log(`Terminating PID ${lock.pid}...`);
                try {
                    await prisma.$queryRaw`SELECT pg_terminate_backend(${lock.pid})`;
                    console.log(`Terminated ${lock.pid}`);
                } catch (err) {
                    console.error(`Failed to terminate ${lock.pid}:`, err);
                }
            }
        } else {
            console.log('No locks found.');
        }

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
