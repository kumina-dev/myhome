import PocketBase from 'pocketbase';
import { createPocketBaseClient } from './pocketBaseClient';

export interface PocketBaseAuthSession {
  isAuthenticated: boolean;
  userId: string | null;
  email: string | null;
}

export interface PocketBaseAuthClient {
  bootstrap(): Promise<PocketBaseAuthSession>;
  signIn(input: {
    email: string;
    password: string;
  }): Promise<PocketBaseAuthSession>;
  signOut(): Promise<PocketBaseAuthSession>;
  getClient(): PocketBase;
}

function readAuthSession(client: PocketBase): PocketBaseAuthSession {
  const record = client.authStore.record as
    | { id?: string; email?: string }
    | null
    | undefined;

  return {
    isAuthenticated: client.authStore.isValid,
    userId: record?.id ?? null,
    email: record?.email ?? null,
  };
}

export class PocketBaseAuthSessionClient implements PocketBaseAuthClient {
  constructor(private readonly client: PocketBase) {}

  async bootstrap(): Promise<PocketBaseAuthSession> {
    return readAuthSession(this.client);
  }

  async signIn(input: {
    email: string;
    password: string;
  }): Promise<PocketBaseAuthSession> {
    await this.client
      .collection('users')
      .authWithPassword(input.email, input.password);

    return readAuthSession(this.client);
  }

  async signOut(): Promise<PocketBaseAuthSession> {
    this.client.authStore.clear();

    return readAuthSession(this.client);
  }

  getClient(): PocketBase {
    return this.client;
  }
}

export async function createPocketBaseAuthClient(): Promise<PocketBaseAuthClient> {
  const client = await createPocketBaseClient();

  return new PocketBaseAuthSessionClient(client);
}
