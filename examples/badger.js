import { build } from '../lib/index.js';

// Script to generate lib/badger.js icons, showing the Javascript equivalent
// of running this command:
//
//   $ ../bin/svg-icon-librarian.js \
//       -f config/badger.yaml \
//       -c icons/badger \
//       -o lib/badger.js \
//       -y

const configFile = 'config/badger.yaml';
const customDir  = 'icons/badger';
const outputFile = 'lib/badger.js';

build({ configFile, customDir, outputFile });
