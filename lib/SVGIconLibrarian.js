import SVGParser from './SVGParser.js';
import { cwd, dir } from '@abw/badger-filesystem';
import { fail, hasValue, splitList } from '@abw/badger-utils';
import { extractFaIconSets } from './fontAwesomeIcons.js'
import { readCustomSVGDir } from './SVGDir.js';
import mergeSelectedIconSets from './mergeSets.js';

const defaults = {
  librarySets:  'iconSets',
  libraryIcons: 'icons',
};

class SVGIconLibrarian {
  constructor(config={}) {
    this.config  = { ...defaults, ...config };
    this.parser  = new SVGParser();
  }

  async buildLibrary(params) {
    const {
      customDir, outputFile, faIcons, iconSets, selectIcons
    } = await this.prepareConfig(params);

    const faSets    = extractFaIconSets(faIcons);
    const custom    = customDir ? await readCustomSVGDir(this.root.dir(customDir)) : { };
    const sets      = this.mergeIconSets(custom, faSets, iconSets);
    const selected  = this.selectIcons(selectIcons, sets);
    return await this.writeIconLibrary(selected, outputFile);
  }

  async prepareConfig(params) {
    // define the root directory from the rootDir parameter or assume current
    // working directory
    this.root = params.rootDir
      ? dir(params.rootDir)
      : cwd();

    // we might might have both selectIcons and a configFile defined and need
    // to merge them together
    const selectIcons = await this.mergeSelectIconsWithConfigFile(
      params.selectIcons,
      params.configFile
    );

    const config = {
      ...params,
      selectIcons
    };

    // if we have any baseIcons defined then we need to do some clever merging
    return params.baseIcons
      ? this.rebaseConfig(config)
      : config;
  }

  async mergeSelectIconsWithConfigFile(selectIcons, configFile) {
    const configData = configFile
      ? await this.readConfigFile(configFile)
      : { }

    if (selectIcons && configFile) {
      const merged = {
        sets: mergeSelectedIconSets(
          configData.sets,
          selectIcons.sets
        ),
        icons: {
          ...(configData.icons || { }),
          ...(selectIcons.icons || { })
        }
      }
      return merged;

    }
    if (selectIcons) {
      return selectIcons;
    }
    if (configFile) {
      return configData;
    }
    fail(`No "selectIcons" or "configFile" option specified`);
  }

  rebaseConfig(params) {
    const baseIcons   = params.baseIcons;
    const selectIcons = params.selectIcons || { };
    const iconSets    = params.iconSets || { };
    let   sets        = { }
    let   icons       = { }

    // If we have any baseIcons defined as an object mapping icon set names
    // to icon definitions, e.g. { badger: { a: ..., b: ... }}
    // then we need to add those base sets to the iconSets configuration
    // item, being careful to also include anything already defined in
    // iconSets.  Then we need to add entries to selectIcons.icons to
    // select each of those icons by their new names with the prefix,
    // e.g. { a: 'badger:a', b: 'badger:b' }
    Object.entries(baseIcons).forEach(
      ([setName, setIcons]) => {
        sets[setName] = setIcons;
        Object.entries(setIcons).forEach(
          ([iconName, iconDef]) => {
            icons[iconName] = `${setName}:${iconName}`;
          },
        )
      }
    )
    return {
      ...params,
      iconSets: {
        ...sets,
        ...iconSets
      },
      selectIcons: {
        ...selectIcons,
        icons: { ...icons, ...(selectIcons.icons || { }) }
      }
    }
  }

  mergeIconSets(...superSets) {
    // Each item in superSets can define a number of sets,
    // e.g { solid: [...], regular: [...] }
    // We need to merge each of the sets together "cleverly" to include all
    // different collection of icons in solid, regular, etc.  Note that this
    // is important because FontAwesome sometimes change the names of their
    // icons so we may be importing a previously generate icon library that
    // used different names.
    return superSets
      .filter( superSet => hasValue(superSet) )
      .reduce(
        (merged, superSet) => {
          Object.entries(superSet).forEach(
            ([setName, setIcons]) => {
              merged[setName] = {
                // include any icons we've already seen with the same set name
                ...(merged[setName] || { }),
                // add in the new one
                ...setIcons
              }
            }
          );
          return merged
        },
        { }
      )
  }

  async readConfigFile(path) {
    const match = path.match(/\.(json|yaml)$/)
      || fail("Configuration file must be .json or .yaml")
    const codec = match[1];
    const file  = this.root.file(path, { codec });
    await file.exists() || fail(`Configuration file does not exist: ${file.path()}`)
    return await file.read();
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
      "/* eslint-disable quotes */\n" +
      this.generateIconSets(selected.sets) +
      "\n" +
      this.generateIconSelection(selected.icons) +
      "\nexport default icons;"
    );
  }

  generateIconSets(sets) {
    return `export const ${this.config.librarySets} = ${JSON.stringify(sets, null, 2)};\n`;
  }

  generateIconSelection(icons) {
    return (
      `export const ${this.config.libraryIcons} = {\n` +
      Object.keys(icons).sort().map(
        name => {
          const [set, icon] = icons[name];
          return `  "${name}": ${this.config.librarySets}["${set}"]["${icon}"]`;
        }
      ).join(",\n") +
      "\n};\n"
    )
  }
}

export default SVGIconLibrarian
