#!/usr/bin/env node
import { build } from '../lib/index.js';
import { iconSets } from './lib/badger.js'

// Script to generate lib/merged.js icons, which builds the lib/merged.js
// library.  This includes the lib/badger.js icons as an additional icon set.

const configFile = 'config/merged.yaml';
const customDir  = 'icons/custom';
const outputFile = 'lib/merged.js';

build({ iconSets, configFile, customDir, outputFile });

