import { prisma } from '@config/db';
import {
  uploadFile as s3UploadFile,
  uploadFiles as s3UploadFiles,
  deleteFile as s3DeleteFile,
  listFiles as s3ListFiles,
} from '@repositories/files.repository';
import { NotFoundError, ValidationError } from '@utils/errors';

async function getServiceConfig(serviceId: string) {
  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) throw new NotFoundError('Service');
  return service;
}

export async function uploadSingleFile(
  file?: Express.Multer.File,
  serviceId?: string,
): Promise<{ url: string; key: string }> {
  if (!file) throw new ValidationError('No file provided');
  if (!serviceId) throw new ValidationError('Service ID required');

  const service = await getServiceConfig(serviceId);

  const prefix = service.folderPrefix ?? 'uploads/';
  const tags: Record<string, string> | undefined =
    typeof service.tags === 'object' &&
    service.tags !== null &&
    !Array.isArray(service.tags)
      ? (service.tags as Record<string, string>)
      : undefined;
  const key = `${prefix}${Date.now()}-${file.originalname}`;

  const url = await s3UploadFile(file, key, tags);
  return { url, key };
}

export async function uploadMultipleFiles(
  files?: Express.Multer.File[],
  serviceId?: string,
): Promise<{ urls: string[]; keys: string[] }> {
  if (!files || files.length === 0)
    throw new ValidationError('No files provided');
  if (!serviceId) throw new ValidationError('Service ID required');

  const service = await getServiceConfig(serviceId);

  const prefix = service.folderPrefix ?? 'uploads/';
  const tags: Record<string, string> | undefined =
    typeof service.tags === 'object' &&
    service.tags !== null &&
    !Array.isArray(service.tags)
      ? (service.tags as Record<string, string>)
      : undefined;

  const uploads = await s3UploadFiles(
    files.map((file) => ({
      file,
      key: `${prefix}${Date.now()}-${file.originalname}`,
      tags,
    })),
  );

  return {
    urls: uploads.map((u) => u.url),
    keys: uploads.map((u) => u.key),
  };
}

export async function listFiles(
  serviceId: string,
  limit = 100,
): Promise<{ key: string; size: number; lastModified?: Date }[]> {
  const service = await getServiceConfig(serviceId);
  const prefix = service.folderPrefix ?? 'uploads/';

  return await s3ListFiles(prefix, limit);
}

export async function deleteFile(key: string): Promise<void> {
  if (!key) throw new ValidationError('File key is required');
  const deleted = await s3DeleteFile(key);
  if (!deleted) throw new NotFoundError('Delete failed or file not found');
}
