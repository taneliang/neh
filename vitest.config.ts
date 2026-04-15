import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    {
      // Inline text/xml loader — replaces jest-raw-loader
      name: 'text-loader',
      transform(code, id) {
        if (id.endsWith('.xml') || id.endsWith('.txt')) {
          return { code: `export default ${JSON.stringify(code)};` };
        }
      },
    },
  ],
  test: {
    globals: true, // describe/test/expect/vi available globally (Jest compat)
    setupFiles: ['./setupJestShim.ts', './setupVitest.ts'],
    environment: 'node',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,js}'],
      exclude: ['**/*.d.ts', '**/*.generated.*', '**/*.test.*'],
      reporter: process.env.CI ? ['text', 'json'] : ['text'],
    },
    reporters: process.env.CI
      ? ['default', ['junit', { outputFile: './test-reports/junit/results.xml' }]]
      : ['default'],
  },
});
