const defaults = {
  librarySets:  'iconSets',
  libraryIcons: 'icons',
};

export function generateIconLibrary(selected, options={ }) {
  const config = { ...defaults, ...options }
  return (
    "/* eslint-disable quotes */\n" +
    generateIconSets(selected.sets, config) +
    "\n" +
    generateIconSelection(selected.icons, config) +
    "\nexport default icons"
  );
}

export function generateMinimizedIconLibrary(selected, options={ }) {
  const config = { ...defaults, ...options }
  return (
    "/* eslint-disable quotes */\n" +
    `export const ${config.libraryIcons} = ${JSON.stringify(selected.icons, null, 2)}\n` +
    "\nexport default icons"
  );
}

function generateIconSets(sets, config) {
  return `export const ${config.librarySets} = ${JSON.stringify(sets, null, 2)}\n`;
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
    "\n}\n"
  )
}
