import { test, expect } from '@playwright/test';
import { tools } from '../../src/data/tools';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('every tool in tools.ts has a visual test', () => {
    const testDir = path.join(__dirname);

    for (const tool of tools) {
        const specFile = path.join(testDir, `${tool.id}.spec.ts`);
        const exists = fs.existsSync(specFile);
        expect(exists, `Missing visual test for tool: ${tool.id}`).toBe(true);
    }
});
