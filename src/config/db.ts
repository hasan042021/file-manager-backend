import logger from '@logger';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'event' },
    { level: 'info', emit: 'event' },
    { level: 'warn', emit: 'event' },
  ],
});

if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e) => {
    logger.info(`
      Query: ${e.query}
      Params: ${e.params}
      Duration: ${e.duration}ms
    `);

    if (e.duration > 1000) {
      logger.warn(`Slow Query Detected:
        Query: ${e.query}
        Duration: ${e.duration}ms
      `);
    }
  });
}

// Error handling
prisma.$on('error', (e) => {
  logger.error('Prisma Error:', e);
});

// Warning handling
prisma.$on('warn', (e) => {
  logger.warn('Prisma Warning:', e);
});

export { prisma };
