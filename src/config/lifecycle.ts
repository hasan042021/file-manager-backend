export const LIFECYCLE_TYPES = {
  PERMANENT: {
    id: 'permanent',
    name: 'Permanent Storage (30-day IA)',
    description: 'Moves to STANDARD_IA after 30 days only',
    tags: { lifecycle: 'permanent' },
    s3Rules: ['PermanentLifecycle'],
  },

  SHORT_TERM: {
    id: 'short-term',
    name: 'Short Term Storage',
    description: 'Auto-delete after 30 days',
    tags: { lifecycle: 'short-term' },
    s3Rules: ['ShortTermDelete'],
  },

  ARCHIVE_READY: {
    id: 'archive-ready',
    name: 'Archive Ready',
    description: 'Move to GLACIER_IR at 90 days, then GLACIER at 180',
    tags: { lifecycle: 'archive-ready' },
    s3Rules: ['ArchiveRule'],
  },

  FULL_ARCHIVAL: {
    id: 'full-archival',
    name: 'Full Archival Lifecycle',
    description:
      'Progressively moves data to cheaper storage classes over time',
    tags: { lifecycle: 'full-archival' },
    s3Rules: ['FullArchivalRule'],
  },
} as const;

export type LifecycleType = keyof typeof LIFECYCLE_TYPES;
