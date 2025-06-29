import { Request, Response } from 'express';
import * as filesService from '@services/files.service';
import { asyncHandler } from '@utils/asyncHandler';

// Extend Express Request interface to include serviceId and service
declare global {
  namespace Express {
    interface Request {
      serviceId?: string;
    }
  }
}

// Upload single file
export const uploadFile = asyncHandler(async (req: Request, res: Response) => {
  const { serviceId, file } = req;

  const result = await filesService.uploadSingleFile(file, serviceId);

  return res.status(201).json({
    success: true,
    data: result,
    message: 'File uploaded successfully',
  });
});

// Upload multiple files
export const uploadFiles = asyncHandler(async (req: Request, res: Response) => {
  const { serviceId, files } = req;

  const result = await filesService.uploadMultipleFiles(
    files as Express.Multer.File[],
    serviceId,
  );

  return res.status(201).json({
    success: true,
    data: result,
    message: 'Files uploaded successfully',
  });
});

// List files (get public URLs)
export const listFiles = asyncHandler(async (req: Request, res: Response) => {
  const { serviceId } = req.body;
  const { maxFiles } = req.query;
  const mxFiles = maxFiles ? parseInt(maxFiles as string) : 100;

  const result = await filesService.listFiles(serviceId, mxFiles);

  return res.json({
    success: true,
    data: result,
    message: 'Files retrieved successfully',
  });
});

// Delete file
export const deleteFile = asyncHandler(async (req: Request, res: Response) => {
  const { fileId } = req.query;

  let fileKey = '';
  if (typeof fileId === 'string') {
    fileKey = fileId;
  }

  await filesService.deleteFile(fileKey);

  return res.json({
    success: true,
    message: 'File deleted successfully',
  });
});
