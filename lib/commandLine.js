#!/usr/bin/env node --enable-source-maps
import { color, options } from '@abw/badger'
import { file } from '@abw/badger-filesystem'
import { fail } from '@abw/badger-utils';
import SVGIconLibrarian from './SVGIconLibrarian.js';

const green = color('bright green')
const red   = color('bright red')

export async function commandLine() {
  try {
    const config      = await readCommandLine()
    const selectIcons = await readConfigFile(config.file);
    const customDir   = config.custom;
    const outputFile  = config.output;
    const librarian   = new SVGIconLibrarian();
    const outfile     = await librarian.buildLibrary({
      selectIcons, customDir, outputFile
    });
    console.log(green(`✓ Wrote icon library to ${outfile}`))
  }
  catch (error) {
    console.log(red(`✗ ${error.message}`))
    // console.log(error);
  }
}

async function readCommandLine() {
  return await options({
    name:         'svg-icon-librarian.js',
    version:      '0.0.1',
    description:  'Generates a library of SVG icons.',
    yes:          true,
    verbose:      true,
    quiet:        true,
    options: [
      {
        name:     'file',
        short:    'f',
        about:    'Configuration file',
        type:     'text',
        prompt:   'Where is the configuration file?',
        required: true,
      },
      {
        name:     'custom',
        short:    'c',
        about:    'Custom directory',
        type:     'text',
        prompt:   'Where is the directory of custom SVG icons?',
      },
      {
        name:     'output',
        short:    'o',
        about:    'Output file',
        type:     'text',
        prompt:   'Where should the output file be written?',
        required: true,
      },
    ]
  });
}

async function readConfigFile(path) {
  const match = path.match(/\.(json|yaml)$/)
    || fail("Configuration file must be .json or .yaml")
  const codec = match[1];
  const cfile = file(path, { codec });
  await cfile.exists() || fail(`Configuration file does not exist: ${cfile.path()}`)
  return await cfile.read();
}

export default commandLine