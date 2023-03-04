import faIcons from './fontAwesomeIcons.js'
import SVGParser from './SVGParser.js';
import { cwd, dir } from '@abw/badger-filesystem';
import { fail, splitList } from '@abw/badger-utils';

const defaults = {
  libraryIconSources: 'iconSources',
  libraryIcons:       'icons',
};

class SVGIconLibrarian {
  constructor(config={}) {
    this.config  = { ...defaults, ...config };
    this.faIcons = this.extractFaIconSets(config.faIcons);
    this.parser  = new SVGParser();
  }

  async buildLibrary(config) {
    const { selectIcons, customDir, outputFile } = config;
    this.root      = config.rootDir ? dir(config.rootDir) : cwd();
    const custom   = customDir ? await this.readCustomSVGDir(customDir) : { };
    const sets     = { custom, ...this.faIcons };
    const selected = this.selectIcons(selectIcons, sets);
    return await this.writeIconLibrary(selected, outputFile);
  }

  extractFaIconSets(iconSets=faIcons) {
    // iterate over the sets of FA icons passed and extract the pertinent data
    return Object.entries(iconSets).reduce(
      (hash, [set, icons]) => {
        hash[set] = this.extractFaIcons(icons)
        return hash
      },
      { }
    )
  }

  extractFaIcons(icons) {
    return Object.values(icons).reduce(
      (hash, icon) => {
        if (icon.icon) {
          const [ width, height, , , path ] = icon.icon;
          hash[icon.iconName] = {
            width,
            height,
            path,
          }
        }
        return hash;
      },
      { }
    )
  }

  async readCustomSVGDir(name) {
    const dir   = this.root.dir(name);
    await dir.exists() || fail(`Custom SVG directory does not exist: ${dir.path()}`);
    const files = await dir.files();
    const svgs  = files.filter( file => file.ext() === '.svg' );
    const icons = await Promise.all(
      svgs.map( svg => this.parser.parseSVGFile(svg) )
    );

    return icons.reduce(
      (hash, icon) => {
        hash[icon.name] = icon.data;
        return hash;
      },
      { }
    )
  }

  selectIcons(select, iconSets) {
    const { icons={}, sets={} } = select;
    let merged = { ...icons };
    let selected = {
      icons:   { },
      sources: { },
    };

    // select can contains "sets" of icons:
    //   sets: { solid: ['one', 'two' ], brands: ['github'] }
    // and we want to merge them into the "icons":
    //   icons: { one: 'solid:one', two: 'solid:two', github: 'brands:github' }
    Object.entries(sets).map(
      ([setName, iconNames]) => {
        const names = iconNames === '*'
          ? Object.keys(iconSets[setName])
          : splitList(iconNames);
        names.forEach( name => merged[name] = `${setName}:${name}`)
      }
    )

    Object.entries(merged).forEach(
      ([name, source]) => {
        // console.log(`select ${name} from ${source}`);
        const [setName, iconName] = source.split(':', 2);
        const set = iconSets[setName]
          || fail(`Invalid icon set "${setName}" specified for ${name}: ${source}`);
        const icon = set[iconName]
          || fail(`Invalid icon name "${iconName}" specified for ${name}: ${source}`)
        selected.sources[source] = icon;
        selected.icons[name] = source;
      }
    )
    return selected;
  }

  async writeIconLibrary(selected, outpath) {
    const outfile = this.root.file(outpath);
    await outfile.directory().mustExist({ create: true });
    await outfile.write(this.generateIconLibrary(selected));
    return outfile.path();
  }

  generateIconLibrary(selected) {
    return (
      this.generateIconSources(selected.sources) +
      "\n" +
      this.generateIconSelection(selected.icons) +
      "\nexport default icons;"
    );
  }

  generateIconSources(icons) {
    const sources = this.config.libraryIconSources;
    return `export const ${sources} = ${JSON.stringify(icons, null, 2)};\n`;
  }

  generateIconSelection(select) {
    const icons   = this.config.libraryIcons;
    const sources = this.config.libraryIconSources;
    return (
      `export const ${icons} = {\n` +
      Object.keys(select).sort().map(
        key => `  "${key}": ${sources}["${select[key]}"]`
      ).join(",\n") +
      "\n};\n"
    )
  }
}

export default SVGIconLibrarian
