import { fail } from '@abw/badger-utils';
import { cwd, dir } from '@abw/badger-filesystem';
import { extractFaIconSets } from './fontAwesomeIcons.js'
import { readCustomSVGDir } from './SVGDir.js';
import { mergeIconSets } from './mergeSets.js';
import { generateIconLibrary } from './generateLibrary.js';
import selectIconsFromSets from './selectIcons.js';
import rebaseConfig from './rebaseConfig.js';


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

    const selectIcons = params.selectIcons ||
      (params.configFile
        ? await this.readConfigFile(params.configFile)
        : fail(`No "selectIcons" or "configFile" option specified`))

    const config = {
      ...params,
      selectIcons
    };

    // if we have any baseIcons defined then we need to do some clever merging
    return params.baseIcons
      ? rebaseConfig(config)
      : config;
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
