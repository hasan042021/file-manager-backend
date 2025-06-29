import { Router } from 'express';
import {
  uploadFile,
  uploadFiles,
  listFiles,
  deleteFile,
} from '@controllers/files.controller';
import { uploadHandler } from '@middlewares/fileUpload.middleware';

const router = Router();

router.post('/upload', uploadHandler({ mode: 'single' }), uploadFile);

router.post(
  '/uploads',
  uploadHandler({ mode: 'multiple', maxFiles: 10 }),
  uploadFiles,
);

router.get('/list', listFiles);

router.delete('/:fileId', deleteFile);

export default router;
