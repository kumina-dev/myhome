import PocketBase, { AsyncAuthStore } from 'pocketbase';
import { PocketBaseAuthStorage } from './authStorage';
import { nativeSecurePocketBaseAuthStorage } from './nativeSecureAuthStorage';
import { getPocketBaseConfig, PocketBaseConfig } from './pocketBaseConfig';

export interface PocketBaseClientOptions {
  config?: PocketBaseConfig;
  authStorage?: PocketBaseAuthStorage;
}

export async function createPocketBaseClient(
  options: PocketBaseClientOptions = {},
): Promise<PocketBase> {
  const config = options.config ?? getPocketBaseConfig();
  const authStorage = options.authStorage ?? nativeSecurePocketBaseAuthStorage;

  const authStore = new AsyncAuthStore({
    initial: authStorage.load(),
    save: (serializedAuth) => authStorage.save(serializedAuth),
    clear: () => authStorage.clear(),
  });

  const client = new PocketBase(config.baseUrl, authStore);
  client.autoCancellation(false);

  return client;
}
