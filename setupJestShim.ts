// jest-fetch-mock references jest.fn() at module load time.
// Alias jest to vi before it loads so the reference resolves.
import { vi } from 'vitest';
(globalThis as Record<string, unknown>).jest = vi;
