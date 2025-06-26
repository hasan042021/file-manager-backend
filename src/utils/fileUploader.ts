import multer from 'multer';
import { UPLOAD_LIMITS, FILE_TYPES } from '@config/fileUpload';
import { ValidationError } from './errors';

// Simple memory storage for S3
const storage = multer.memoryStorage();

const createFileFilter = (allowedTypes: string[]) => {
  return (
    _req: any,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback,
  ) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ValidationError(`File type ${file.mimetype} not allowed`));
    }
  };
};

export const createUploader = (
  allowedTypes: string[] = FILE_TYPES.DOCUMENT,
) => {
  return multer({
    storage,
    limits: {
      fileSize: UPLOAD_LIMITS.MAX_FILE_SIZE,
      files: UPLOAD_LIMITS.MAX_FILES,
    },
    fileFilter: createFileFilter(allowedTypes),
  });
};
