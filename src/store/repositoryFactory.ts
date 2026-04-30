import { createDevelopmentRepositories } from './developmentApi';
import { AppRepositories } from './repositories';

type RepositoryBackendMode = 'development' | 'pocketbase-auth';

const repositoryBackendMode: RepositoryBackendMode = 'pocketbase-auth';

export function createAppRepositories(): AppRepositories {
  if (repositoryBackendMode === 'pocketbase-auth') {
    const { createPocketBaseRepositories } =
      require('./pocketBaseRepositories') as typeof import('./pocketBaseRepositories');

    return createPocketBaseRepositories();
  }

  return createDevelopmentRepositories();
}
