import { Request, Response } from 'express';
import * as ApiKeyRepo from '@repositories/apiKey.repository';
import { asyncHandler } from '@utils/asyncHandler';

export const createAPIKey = asyncHandler(
  async (req: Request, res: Response) => {
    const { serviceName, lifecyclePolicy, key } = req.body;

    if (!serviceName || !lifecyclePolicy || !key) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const apiKey = await ApiKeyRepo.createApiKey({
      serviceName,
      lifecyclePolicy,
      key,
    });

    return res.status(201).json(apiKey);
  },
);

export const getAllApiKeys = async (_req: Request, res: Response) => {
  try {
    const apiKeys = await ApiKeyRepo.getAllApiKeys();
    res.json(apiKeys);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal error' });
  }
};
