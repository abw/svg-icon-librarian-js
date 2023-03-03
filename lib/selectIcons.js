import { fail } from '@abw/badger-utils';

export function selectIcons(select, sets) {
  // Iterate over the icons sets that we've got (solid, regular, custom, etc)
  // and look in select to see which icons we want to select, e.g.
  // select.solid, select.regular, select.custom.  Then construct a hash array
  // mapping the icon name to the icon definition from that set
  let icons = Object.entries(sets).reduce(
    (hash, [setName, iconSet]) => {
      // console.log(`${setName} set has `, Object.keys(iconSet).join(', '));
      const selectFromSet = select[setName] || [ ];
      selectFromSet.forEach(
        name => {
          hash[name] = iconSet[name] || fail(`Icon ${name} not found in ${setName} icon set`)
        }
      )
      return hash
    },
    { }
  )

  // Now go over any aliases defined in the select.alias section and copy the
  // icon from the set into the alias, e.g. ok: "solid:circle-check" creates
  // and alias "ok" for the "circle-check" icon in the "solid" icon set.
  Object.entries(select.alias || { }).forEach(
    ([alias, source]) => {
      const [setName, iconName] = source.split(':', 2);
      const set = sets[setName]
        || fail(`Invalid icon set "${setName}" specified in alias ${alias}: ${source}`);
      const icon = set[iconName]
        || fail(`Invalid icon name "${iconName}"specified in alias ${alias}: ${source}`)
      if (icons[alias]) {
        fail(`Icon alias "${alias}" would overwrite existing icon from ${icons[alias].set} set`)
      }
      icons[alias] = icon;
    }
  )

  // Now that we've done that we don't really need the icon.set any more
  Object.values(icons).forEach(
    icon => delete icon.set
  )

  return icons;
}
