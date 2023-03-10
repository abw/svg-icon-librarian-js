import SVGParser from './SVGParser.js';
import { fail } from '@abw/badger-utils';

export async function readCustomSVGDir(dir) {
  await dir.exists() || fail(`Custom SVG directory does not exist: ${dir}`);

  const parser = new SVGParser();
  const files = await dir.files();
  const svgs  = files.filter( file => file.ext() === '.svg' );
  const icons = await Promise.all(
    svgs.map( svg => parser.parseSVGFile(svg) )
  );

  return {
    [dir.name()]: icons.reduce(
      (hash, icon) => {
        hash[icon.name] = icon.data;
        return hash;
      },
      { }
    )
  }
}
