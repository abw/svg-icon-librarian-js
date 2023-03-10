const defaults = {
  librarySets:  'iconSets',
  libraryIcons: 'icons',
};

export function generateIconLibrary(selected, config=defaults) {
  return (
    "/* eslint-disable quotes */\n" +
    generateIconSets(selected.sets, config) +
    "\n" +
    generateIconSelection(selected.icons, config) +
    "\nexport default icons;"
  );
}

function generateIconSets(sets, config) {
  return `export const ${config.librarySets} = ${JSON.stringify(sets, null, 2)};\n`;
}

function generateIconSelection(icons, config) {
  return (
    `export const ${config.libraryIcons} = {\n` +
    Object.keys(icons).sort().map(
      name => {
        const [set, icon] = icons[name];
        return `  "${name}": ${config.librarySets}["${set}"]["${icon}"]`;
      }
    ).join(",\n") +
    "\n};\n"
  )
}
