import { file } from '@abw/badger';

export async function writeIconlibrary(select, icons, outpath) {
  const outfile = file(outpath);
  await outfile.directory().mustExist({ create: true });
  await outfile.write(
    generateIconSelection(select) +
    "\n" +
    generateIconLibrary(icons) +
    "\nexport default iconLibrary;"
  );
  return outfile.path();
}

function generateIconSelection(select) {
  return `export const iconSelection = ${JSON.stringify(select, null, 2)};\n`;
}

function generateIconLibrary(icons) {
  return `export const iconLibrary = ${JSON.stringify(icons, null, 2)};\n`;
}
