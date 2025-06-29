import { LIFECYCLE_TYPES, LifecycleType } from '@config/lifecycle';

export function getLifecycleConfig(
  type: string,
): (typeof LIFECYCLE_TYPES)[LifecycleType] {
  if (!Object.hasOwn(LIFECYCLE_TYPES, type)) {
    throw new Error(`Invalid lifecycle type: ${type}`);
  }

  return LIFECYCLE_TYPES[type as LifecycleType];
}
