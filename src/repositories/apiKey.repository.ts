import { prisma } from '@config/db';

export async function createApiKey(data: { key: string; serviceId: string }) {
  return prisma.apiKey.create({
    data,
    include: { service: true },
  });
}

export async function getAllApiKeys() {
  return prisma.apiKey.findMany({ include: { service: true } });
}
