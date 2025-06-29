// scripts/applyLifecycleRules.ts

import {
  S3Client,
  PutBucketLifecycleConfigurationCommand,
} from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

async function applyLifecycleRules() {
  const command = new PutBucketLifecycleConfigurationCommand({
    Bucket: BUCKET_NAME!,
    LifecycleConfiguration: {
      Rules: [
        {
          ID: 'PermanentLifecycle',
          Status: 'Enabled',
          Filter: {
            Tag: { Key: 'lifecycle', Value: 'permanent' },
          },
          Transitions: [{ Days: 30, StorageClass: 'STANDARD_IA' }],
        },
        {
          ID: 'ShortTermDelete',
          Status: 'Enabled',
          Filter: {
            Tag: { Key: 'lifecycle', Value: 'short-term' },
          },
          Expiration: { Days: 30 },
        },
        {
          ID: 'ArchiveRule',
          Status: 'Enabled',
          Filter: {
            Tag: { Key: 'lifecycle', Value: 'archive-ready' },
          },
          Transitions: [
            { Days: 90, StorageClass: 'GLACIER_IR' },
            { Days: 180, StorageClass: 'GLACIER' },
          ],
        },
        {
          ID: 'FullArchivalRule',
          Status: 'Enabled',
          Filter: {
            Tag: { Key: 'lifecycle', Value: 'full-archival' },
          },
          Transitions: [
            { Days: 30, StorageClass: 'STANDARD_IA' },
            { Days: 90, StorageClass: 'GLACIER_IR' },
            { Days: 180, StorageClass: 'GLACIER' },
            { Days: 365, StorageClass: 'DEEP_ARCHIVE' },
          ],
        },
      ],
    },
  });

  try {
    await s3.send(command);
    console.log(
      '✅ Lifecycle rules successfully applied to bucket:',
      BUCKET_NAME,
    );
  } catch (error) {
    console.error('❌ Failed to apply lifecycle rules:', error);
  }
}

applyLifecycleRules();
