export const FILE_TYPES = {
  IMAGE: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/webp'],
  DOCUMENT: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  VIDEO: ['video/mp4', 'video/mpeg', 'video/quicktime'],
};

export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILES: 5,
};
