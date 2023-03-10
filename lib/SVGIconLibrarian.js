import { cwd, dir } from '@abw/badger-filesystem';
import { fail } from '@abw/badger-utils';
import { extractFaIconSets } from './fontAwesomeIcons.js'
import { readCustomSVGDir } from './SVGDir.js';
import { mergeIconSets, mergeSelectIconsWithConfigData } from './mergeSets.js';
import { generateIconLibrary } from './generateLibrary.js';
import selectIconsFromSets from './selectIcons.js';


class SVGIconLibrarian {
  constructor(config={}) {
    this.config  = config;
  }

  async buildLibrary(params) {
    const {
      customDir, outputFile, faIcons, iconSets, selectIcons
    } = await this.prepareConfig(params);

    const faSets    = extractFaIconSets(faIcons);
    const custom    = customDir ? await readCustomSVGDir(this.root.dir(customDir)) : { };
    const sets      = mergeIconSets(custom, faSets, iconSets);
    const selected  = selectIconsFromSets(selectIcons, sets);
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
      return mergeSelectIconsWithConfigData(
        selectIcons, configFile
      )
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
          ([iconName]) => {
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

  async readConfigFile(path) {
    const match = path.match(/\.(json|yaml)$/)
      || fail("Configuration file must be .json or .yaml")
    const codec = match[1];
    const file  = this.root.file(path, { codec });
    await file.exists() || fail(`Configuration file does not exist: ${file.path()}`)
    return await file.read();
  }

  async writeIconLibrary(selected, outpath) {
    const outfile = this.root.file(outpath);
    await outfile.directory().mustExist({ create: true });
    await outfile.write(generateIconLibrary(selected));
    return outfile.path();
  }
}

export default SVGIconLibrarian
