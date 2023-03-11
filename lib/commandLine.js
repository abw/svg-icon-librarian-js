#!/usr/bin/env node --enable-source-maps
import SVGIconLibrarian from './SVGIconLibrarian.js';
import { appStatus, brightGreen, brightRed, options, quit } from '@abw/badger'
import { file } from '@abw/badger-filesystem'
import { fail } from '@abw/badger-utils';

export const commandLine = appStatus(
  async props => {
    const config      = (await readCommandLine(props))
      || quit(brightRed("Cancelled"))
    const selectIcons = await readConfigFile(config.file);
    const customDir   = config.custom;
    const outputFile  = config.output;
    const librarian   = new SVGIconLibrarian();
    const outfile     = await librarian.buildLibrary({
      ...props,
      selectIcons, customDir, outputFile
    });
    return brightGreen(`Wrote icon library to ${outfile}`)
  }
)

async function readCommandLine(props={}) {
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
        default:  props.file,
      },
      {
        name:     'custom',
        short:    'c',
        about:    'Custom directory',
        type:     'text',
        prompt:   'Where is the directory of custom SVG icons?',
        default:  props.custom,
      },
      {
        name:     'output',
        short:    'o',
        about:    'Output file',
        type:     'text',
        prompt:   'Where should the output file be written?',
        required: true,
        default:  props.output,
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