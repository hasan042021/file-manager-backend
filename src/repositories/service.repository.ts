import { prisma } from '@config/db';

export async function findServiceByName(serviceName: string) {
  return prisma.service.findUnique({ where: { serviceName } });
}
export async function findServiceById(id: string) {
  return prisma.service.findUnique({ where: { id } });
}

export async function createService(data: {
  serviceName: string;
  lifecyclePolicy: string;
  tags: Record<string, string>;
}) {
  return prisma.service.create({ data });
}

export async function updateService(
  id: string,
  data: Partial<{ lifecyclePolicy: string; tags: Record<string, string> }>,
) {
  return prisma.service.update({
    where: { id },
    data,
  });
}
