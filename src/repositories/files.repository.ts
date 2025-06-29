import {
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import s3Client from '@config/s3client';

const BUCKET = process.env.AWS_S3_BUCKET_NAME!;
const REGION = process.env.AWS_REGION!;

// Tags are encoded as "key1=value1&key2=value2"
function encodeTags(tags?: Record<string, string>): string | undefined {
  if (!tags) return undefined;
  return Object.entries(tags)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
}

export const uploadFile = async (
  file: Express.Multer.File,
  key: string,
  tags?: Record<string, string>,
): Promise<string> => {
  const Tagging = encodeTags(tags);
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    Tagging,
  });

  await s3Client.send(command);
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
};

export async function uploadFiles(
  entries: {
    file: Express.Multer.File;
    key: string;
    tags?: Record<string, string>;
  }[],
): Promise<{ url: string; key: string }[]> {
  return Promise.all(
    entries.map(async ({ file, key, tags }) => ({
      url: await uploadFile(file, key, tags),
      key,
    })),
  );
}

export async function deleteFile(key: string): Promise<boolean> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    });
    await s3Client.send(command);
    return true;
  } catch (err) {
    console.error('S3 Delete Error:', err);
    return false;
  }
}

export async function listFiles(
  prefix: string,
  limit = 100,
): Promise<{ key: string; size: number; lastModified?: Date }[]> {
  const command = new ListObjectsV2Command({
    Bucket: BUCKET,
    Prefix: prefix,
    MaxKeys: limit,
  });

  const response = await s3Client.send(command);

  return (
    response.Contents?.map((item) => ({
      key: item.Key!,
      size: item.Size!,
      lastModified: item.LastModified,
    })) || []
  );
}
