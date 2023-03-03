#!/usr/bin/env node --enable-source-maps
import { commandLine } from '../lib/index.js';

async function main() {
  await commandLine();
}

main();