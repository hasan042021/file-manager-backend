import * as ApiKeyRepo from '@repositories/apiKey.repository';
import * as ServiceRepo from '@repositories/service.repository';
import { getLifecycleConfig } from '@utils/lifecycle';

export async function createApiKey({
  serviceName,
  lifecyclePolicy,
  key,
}: {
  serviceName: string;
  lifecyclePolicy: string;
  key: string;
}) {
  let service = await ServiceRepo.findServiceByName(serviceName);

  if (!service) {
    const config = getLifecycleConfig(lifecyclePolicy);
    service = await ServiceRepo.createService({
      serviceName,
      lifecyclePolicy: config.id,
      tags: config.tags,
    });
  } else if (service.lifecyclePolicy !== lifecyclePolicy) {
    const config = getLifecycleConfig(lifecyclePolicy);
    service = await ServiceRepo.updateService(service.id, {
      lifecyclePolicy: config.id,
      tags: config.tags,
    });
  }
  const result = await ApiKeyRepo.createApiKey({ key, serviceId: service.id });

  return result;
}

export async function getAllApiKeys() {
  return ApiKeyRepo.getAllApiKeys();
}
