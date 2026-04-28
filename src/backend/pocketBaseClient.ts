import PocketBase, { AsyncAuthStore } from 'pocketbase';
import {
  memoryPocketBaseAuthStorage,
  PocketBaseAuthStorage,
} from './authStorage';
import { getPocketBaseConfig, PocketBaseConfig } from './pocketBaseConfig';

export interface PocketBaseClientOptions {
  config?: PocketBaseConfig;
  authStorage?: PocketBaseAuthStorage;
}

export async function createPocketBaseClient(
  options: PocketBaseClientOptions = {},
): Promise<PocketBase> {
  const config = options.config ?? getPocketBaseConfig();
  const authStorage = options.authStorage ?? memoryPocketBaseAuthStorage;

  const authStore = new AsyncAuthStore({
    initial: authStorage.load(),
    save: serializedAuth => authStorage.save(serializedAuth),
    clear: () => authStorage.clear(),
  });

  return new PocketBase(config.baseUrl, authStore);
}
