import { fail } from '@abw/badger-utils'

export class SVGParser {
  async parseSVGFile(file) {
    const text = await file.read();
    return {
      name: file.name(),
      data: this.parseSVGText(text, file.path())
    }
  }

  parseSVGText(svg, name) {
    const matchSVG = svg.match(/<svg\s+([^]*?)>/)
      || fail(`Can't find <svg> element in ${name}`);
    const svgElem = matchSVG[1];
    const attrs   = this.parseAttributes(svgElem);
    const paths   = this.parsePaths(svg);

    const [minx, miny, width, height] = attrs.viewBox.split(' ').map( d => parseFloat(d) );
    let data = { width, height };
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

  parseAttributes(text) {
    return [ ...text.matchAll(/(\w+)="([^]*?)"/g) ]
      .map( match => match.slice(1, 3) )
      .reduce(
        (hash, [key, value]) => {
          hash[key] = value;
          return hash;
        },
        { }
      );
  }

  parsePaths(svg) {
    return [ ...svg.matchAll(/<path\s*([^]*?)(\/>|<\/path>)/g) ]
      .map( match => this.parseAttributes(match[1]) )
      .map(
        attrs => {
          delete attrs.fill;
          return Object.keys(attrs).length > 1
            ? attrs
            : attrs.d;
        }
      )
  }
}

export default SVGParser