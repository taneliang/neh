// Regenerates src/resources/tlds.ts from the canonical IANA TLD list.
//
// Run with `node scripts/generate-tlds.js`. The output is committed to the
// repo (it's slow-changing reference data) rather than fetched at build time,
// so builds and deploys don't depend on data.iana.org being reachable.

const fs = require('fs');
const path = require('path');
const https = require('https');

const SOURCE_URL = 'https://data.iana.org/TLD/tlds-alpha-by-domain.txt';

function fetch(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Unexpected status ${res.statusCode} from ${url}`));
          return;
        }
        let body = '';
        res.setEncoding('utf-8');
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => resolve(body));
      })
      .on('error', reject);
  });
}

async function main() {
  const raw = await fetch(SOURCE_URL);
  const tlds = raw
    .split('\n')
    .map((line) => line.trim().toLowerCase())
    .filter((line) => line && !line.startsWith('#'))
    .sort();

  const out = `// AUTO-GENERATED — do not edit; regenerate with \`node scripts/generate-tlds.js\`.
// Source: ${SOURCE_URL}
const TLDS =
  '${tlds.join(' ')}';

// Set of valid top-level domains (lowercase), e.g. "com", "science", "io".
const tldSet = new Set(TLDS.split(' '));

export default tldSet;
`;

  fs.writeFileSync(path.join(__dirname, '../src/resources/tlds.ts'), out);
  console.log(`generate-tlds: wrote ${tlds.length} TLDs`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
