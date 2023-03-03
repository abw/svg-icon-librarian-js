import { dir } from '@abw/badger';
import { fail } from '@abw/badger-utils';

export async function readSvgDir(path) {
  const d = dir(path);
  await d.exists() || fail('Custom SVG directory does not exist: ', path);
  const entries = await d.read();
  const svgs = entries.filter( name => name.match(/\.svg$/) );
  const icons = await Promise.all(
    svgs.map( svg => readSvgFile(d.file(svg)) )
  );
  return icons.reduce(
    (hash, icon) => {
      hash[icon.name] = icon;
      delete icon.name
      icon.set = 'custom'
      return hash;
    },
    { }
  )
}

export async function readSvgFile(file) {
  const name    = file.path().replace(/.svg$/, '').replace(/^.*\//, '');
  const text    = await file.read();
  const svgElem = matchValue(text, /<svg\s+(.*?)>/) || fail("Can't find <svg> element in". file.path());
  const attrs   = parseAttributes(svgElem);
  const paths   = parsePaths(text);

  // const {width, height, viewBox} = attrs;
  const [minx, miny, width, height] = attrs.viewBox.split(' ').map( d => parseFloat(d) );
  let data = { name, width, height };
  if (minx !== 0) {
    data.minx = minx;
  }
  if (miny !== 0) {
    data.miny = minx;
  }
  if (paths.length > 1) {
    data.paths = paths;
  }
  else {
    data.path = paths[0]
  }

  return data;
}

export function parseAttributes(text) {
  return [ ...text.matchAll(/(\w+)="(.*?)"/g) ]
    .map( match => match.slice(1, 3) )
    .reduce(
      (hash, [key, value]) => {
        hash[key] = value;
        return hash;
      },
      { }
    );
}

export function parseStyle(style) {
  // e.g. fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round
  return [ ...style.matchAll(/\s*([\w-]*?)\s*:\s*(.*?)(;|$)/g)]
    .map( match => match.slice(1, 3) )
    .reduce(
      (hash, [key, value]) => {
        hash[key] = value;
        return hash;
      },
      { }
    );
}

export function parsePaths(svg) {
  return [ ...svg.matchAll(/<path\s*([^]*?)(\/>|<\/path>)/g) ]
    .map( match => parseAttributes(match[1]) )
    .map(
      attrs => {
        if (attrs.style) {
          //attrs.style = parseStyle(attrs.style)
        }
        delete attrs.fill;
        return Object.keys(attrs).length > 1
          ? attrs
          : attrs.d;
      }
    )
}

function matchValue(string, regex) {
  const match = string.match(regex);
  return match ? match[1] : undefined;
}

