import faIcons from './fontAwesomeIcons.js'
import SVGParser from './SVGParser.js';
import { cwd, dir } from '@abw/badger-filesystem';
import { fail, splitList } from '@abw/badger-utils';

const defaults = {
  libraryIconSets: 'iconSets',
  libraryIcons:    'icons',
};

class SVGIconLibrarian {
  constructor(config={}) {
    this.config  = { ...defaults, ...config };
    this.faIcons = this.extractFaIconSets(config.faIcons);
    this.parser  = new SVGParser();
  }

  async buildLibrary(config) {
    const { customDir, outputFile, iconSets } = config;
    this.root      = config.rootDir ? dir(config.rootDir) : cwd();
    const custom   = customDir ? await this.readCustomSVGDir(customDir) : { };
    const sets     = { ...custom, ...this.faIcons, ...iconSets };
    const select   = await this.selectIconsOrConfigFile(config);
    const selected = this.selectIcons(select, sets);
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

  async selectIconsOrConfigFile(config) {
    const { selectIcons, configFile } = config;
    if (selectIcons) {
      return selectIcons;
    }
    else if (configFile) {
      return await this.readConfigFile(configFile);
    }
    fail(`No "selectIcons" or "configFile" option specified`);
  }

  async readConfigFile(path) {
    const match = path.match(/\.(json|yaml)$/)
      || fail("Configuration file must be .json or .yaml")
    const codec = match[1];
    const file  = this.root.file(path, { codec });
    await file.exists() || fail(`Configuration file does not exist: ${file.path()}`)
    return await file.read();
  }

  async readCustomSVGDir(name) {
    const dir   = this.root.dir(name);
    await dir.exists() || fail(`Custom SVG directory does not exist: ${dir.path()}`);
    const files = await dir.files();
    const svgs  = files.filter( file => file.ext() === '.svg' );
    const icons = await Promise.all(
      svgs.map( svg => this.parser.parseSVGFile(svg) )
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

  selectIcons(select, iconSets) {
    const { icons={}, sets={} } = select;
    let merged = { ...icons };
    let selected = {
      sets:    { },
      icons:   { },
    };

    // select can contains "sets" of icons:
    //   sets: { solid: ['one', 'two' ], brands: ['github'] }
    // and we want to merge them into the "icons":
    //   icons: { one: 'solid:one', two: 'solid:two', github: 'brands:github' }
    Object.entries(sets).map(
      ([setName, iconNames]) => {
        const names = iconNames === '*'
          ? Object.keys(iconSets[setName] || fail(`Invalid icon set specified: ${setName}: ${iconNames}`))
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
        selected.sets[setName] ||= { };
        selected.sets[setName][iconName] = icon;
        selected.icons[name] = [setName, iconName];
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
      this.generateIconSets(selected.sets) +
      "\n" +
      this.generateIconSelection(selected.icons) +
      "\nexport default icons;"
    );
  }

  generateIconSets(sets) {
    return `export const ${this.config.libraryIconSets} = ${JSON.stringify(sets, null, 2)};\n`;
  }

  generateIconSelection(icons) {
    return (
      `export const ${this.config.libraryIcons} = {\n` +
      Object.keys(icons).sort().map(
        name => {
          const [set, icon] = icons[name];
          return `  "${name}": ${this.config.libraryIconSets}["${set}"]["${icon}"]`;
        }
      ).join(",\n") +
      "\n};\n"
    )
  }
}

export default SVGIconLibrarian
