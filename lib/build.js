#!/usr/bin/env node --enable-source-maps
import { color } from '@abw/badger'
import SVGIconLibrarian from './SVGIconLibrarian.js';

const green = color('bright green')
const red   = color('bright red')

export async function build(config={}) {
  try {
    const librarian = new SVGIconLibrarian();
    const outfile   = await librarian.buildLibrary(config);
    console.log(green(`✓ Wrote icon library to ${outfile}`))
  }
  catch (error) {
    console.log(red(`✗ ${error.message}`))
  }
}

