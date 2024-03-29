import { fail, isString, splitList } from '@abw/badger-utils';

// select can contains "sets" of icons:
//   sets: { solid: ['one', 'two' ], brands: ['github'] }
// iconSets contains those "sets" that can be selected from
//   sets: { solid: { one: 'one', two: 'two' }, brands: { github: 'github' } }
// and we want to merge them into the "icons":
//   icons: { one: 'solid:one', two: 'solid:two', github: 'brands:github' }

export function selectIconsFromSets(select, iconSets, config={}) {
  const { icons={}, sets={} } = select;
  const { minimize } = config
  let merged = { ...icons };
  let selected = {
    sets:    { },
    icons:   { },
  };

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
      let icon = set[iconName]
        || fail(`Invalid icon name "${iconName}" specified for ${name}: ${source}`)

      if (minimize && icon.width === 512 && icon.height === 512 && isString(icon.path)) {
        icon = icon.path
      }

      selected.sets[setName] ||= { };
      selected.sets[setName][iconName] = icon;
      selected.icons[name] = minimize ? icon : [setName, iconName];
    }
  )
  return selected;
}

export default selectIconsFromSets