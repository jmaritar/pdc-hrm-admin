import fs from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(import.meta.url), '../../');
const client = resolve(root, 'dist/browser');
const cloudflare = resolve(root, 'dist/cloudflare');

fs.cpSync(client, cloudflare, { recursive: true });

console.log('✅ Copied files from client to Cloudflare. ✅');
