import makeCloudflareWorkerEnv from 'cloudflare-worker-mock';
import { enableFetchMocks } from 'jest-fetch-mock';

// Object.assign fails on getter-only globals (e.g. navigator in Node 22+).
// Assign each property individually, skipping those that throw.
const workerEnv = makeCloudflareWorkerEnv() as Record<string, unknown>;
for (const key of Object.keys(workerEnv)) {
  try {
    (global as Record<string, unknown>)[key] = workerEnv[key];
  } catch {
    // skip getter-only / non-configurable properties
  }
}

enableFetchMocks(); // installs jest-fetch-mock as global.fetch
