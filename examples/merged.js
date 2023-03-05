#!/usr/bin/env node
import { build } from '../lib/index.js';
import { iconSets } from './lib/badger.js'

// Script to generate lib/merged.js icons, which builds the lib/merged.js
// library.  This includes the lib/badger.js icons as an additional icon set.
//
// IMPORTANT: You will need to run the ./badger.js script first to generate
// the lib/badger.js file.

const configFile = 'config/merged.yaml';
const customDir  = 'icons/custom';
const outputFile = 'lib/merged.js';

build({ iconSets, configFile, customDir, outputFile });

