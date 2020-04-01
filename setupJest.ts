import makeCloudflareWorkerEnv from 'cloudflare-worker-mock';
import jestFetchMock, { GlobalWithFetchMock } from 'jest-fetch-mock';

Object.assign(global, makeCloudflareWorkerEnv());

const customGlobal = global as GlobalWithFetchMock;
customGlobal.fetch = jestFetchMock;
customGlobal.fetchMock = customGlobal.fetch;
