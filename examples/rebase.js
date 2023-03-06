#!/usr/bin/env node
import { build } from '../lib/index.js';
import { icons } from './lib/badger.js'

// Script to generate lib/rebase.js icons, which includes everything in
// lib/badger.js by default.  The baseIcons option is useful if you want
// to build a new icon library based on an existing icon library.  All the
// icons from the base library are included by default and you can add new
// icons or selectively replace icons from the base library.

const configFile = 'config/rebase.yaml';
const outputFile = 'lib/rebase.js';
build({ configFile, outputFile, baseIcons: { badger: icons } });
