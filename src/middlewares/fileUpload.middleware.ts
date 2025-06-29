import { Request, Response, NextFunction } from 'express';
import { FILE_TYPES } from '@config/fileUpload';
import { createUploader } from '@utils/fileUploader';

interface UploadOptions {
  allowedTypes?: string[];
  maxFiles?: number;
  fieldName?: string;
  mode?: 'single' | 'multiple';
}

export const uploadHandler = (options: UploadOptions = {}) => {
  const {
    allowedTypes = options.allowedTypes || [
      ...FILE_TYPES.IMAGE,
      ...FILE_TYPES.DOCUMENT,
      ...FILE_TYPES.VIDEO,
    ],
    maxFiles = 5,
    fieldName = options.mode === 'single' ? 'file' : 'files',
    mode = 'single',
  } = options;

  const uploader = createUploader(allowedTypes);

  return (req: Request, res: Response, next: NextFunction) => {
    const middleware =
      mode === 'single'
        ? uploader.single(fieldName)
        : uploader.array(fieldName, maxFiles);

    middleware(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          error: err.message,
        });
      }

      if (
        (mode === 'single' && !req.file) ||
        (mode === 'multiple' &&
          (!req.files || !Array.isArray(req.files) || req.files.length === 0))
      ) {
        return res.status(400).json({
          success: false,
          error: 'No file(s) uploaded',
        });
      }

      return next();
    });
  };
};
