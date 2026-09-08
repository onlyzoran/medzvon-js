#!/usr/bin/env node
import { classifyIntent } from './index.js';

const text = process.argv.slice(2).join(' ');

if (!text) {
    console.error('Usage: npm run cli -- "<text>"');
    process.exit(1);
}

const result = classifyIntent(text, { debug: true });

console.log(JSON.stringify(result, null, 2));
