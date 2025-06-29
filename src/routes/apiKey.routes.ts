import { Router } from 'express';
import * as ApiKeyController from '@controllers/apiKey.controller';

const router = Router();

router.post('/apikeys', ApiKeyController.createAPIKey);
router.get('/apikeys', ApiKeyController.getAllApiKeys);

export default router;
