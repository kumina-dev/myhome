export interface PocketBaseAuthStorage {
  load(): Promise<string | null>;
  save(serializedAuth: string): Promise<void>;
  clear(): Promise<void>;
}

export class MemoryPocketBaseAuthStorage implements PocketBaseAuthStorage {
  private serializedAuth: string | null = null;

  async load(): Promise<string | null> {
    return this.serializedAuth;
  }

  async save(serializedAuth: string): Promise<void> {
    this.serializedAuth = serializedAuth;
  }

  async clear(): Promise<void> {
    this.serializedAuth = null;
  }
}

export const memoryPocketBaseAuthStorage = new MemoryPocketBaseAuthStorage();

export function isValidSerializedPocketBaseAuth(
  value: string | null,
): value is string {
  if (!value) return false;

  try {
    const parsed = JSON.parse(value) as { token?: unknown; record?: unknown };
    return typeof parsed.token === 'string';
  } catch {
    return false;
  }
}
