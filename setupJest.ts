import makeCloudflareWorkerEnv from 'cloudflare-worker-mock';
Object.assign(global, makeCloudflareWorkerEnv());
