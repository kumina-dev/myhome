import { NativeModules, Platform } from 'react-native';
import {
  isValidSerializedPocketBaseAuth,
  memoryPocketBaseAuthStorage,
  PocketBaseAuthStorage,
} from './authStorage';

const AUTH_STORAGE_KEY = 'pocketbase_auth';

interface CirclSecureStoreNativeModule {
  load(key: string): Promise<string | null>;
  save(key: string, value: string): Promise<void>;
  clear(key: string): Promise<void>;
}

function getNativeSecureStore(): CirclSecureStoreNativeModule | null {
  if (Platform.OS !== 'android') {
    return null;
  }

  return (
    (NativeModules.CirclSecureStore as
      | CirclSecureStoreNativeModule
      | undefined) ?? null
  );
}

class NativeSecurePocketBaseAuthStorage implements PocketBaseAuthStorage {
  async load(): Promise<string | null> {
    const secureStore = getNativeSecureStore();

    if (!secureStore) {
      return memoryPocketBaseAuthStorage.load();
    }

    const serializedAuth = await secureStore.load(AUTH_STORAGE_KEY);

    return isValidSerializedPocketBaseAuth(serializedAuth)
      ? serializedAuth
      : null;
  }

  async save(serializedAuth: string): Promise<void> {
    if (!isValidSerializedPocketBaseAuth(serializedAuth)) {
      await this.clear();
      return;
    }

    const secureStore = getNativeSecureStore();

    if (!secureStore) {
      await memoryPocketBaseAuthStorage.save(serializedAuth);
      return;
    }

    await secureStore.save(AUTH_STORAGE_KEY, serializedAuth);
  }

  async clear(): Promise<void> {
    const secureStore = getNativeSecureStore();

    if (!secureStore) {
      await memoryPocketBaseAuthStorage.clear();
      return;
    }

    await secureStore.clear(AUTH_STORAGE_KEY);
  }
}

export const nativeSecurePocketBaseAuthStorage =
  new NativeSecurePocketBaseAuthStorage();
