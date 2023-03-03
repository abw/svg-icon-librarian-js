import { readSvgDir }        from './SVGFile.js';
import { selectIcons }       from './selectIcons.js';
import { writeIconlibrary }  from './libraryWriter.js';
import { extractFaIconSets } from './fontAwesomeIcons.js';

export async function SVGIconLibrarian(config) {
  const { selectIcons, iconSets, customDir, outputFile } = config;
  const fa     = extractFaIconSets(iconSets);
  const custom = customDir ? await readSvgDir(customDir) : { };
  const sets   = { custom, ...fa };
  let select   = { ...selectIcons };

  // default selection to include all custom icons
  select.custom ||= Object.keys(custom);

  const icons  = selectIcons(select, sets)
  const out    = await writeIconlibrary(select, icons, outputFile);
  return out;
}

export default SVGIconLibrarian