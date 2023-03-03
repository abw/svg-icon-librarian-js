import * as faSolid   from '@fortawesome/free-solid-svg-icons'
import * as faRegular from '@fortawesome/free-regular-svg-icons'

const faSets = {
  solid:   faSolid,
  regular: faRegular,
}

export function extractFaIconSets(sets=faSets) {
  // iterate over the sets of FA icons passed and extract the pertinent data
  return Object.entries(sets).reduce(
    (hash, [set, icons]) => {
      hash[set] = extractFaIcons(set, icons)
      return hash
    },
    { }
  )
}

export function extractFaIcons(set, icons) {
  return Object.values(icons).reduce(
    (hash, icon) => {
      if (icon.icon) {
        const [ width, height, , , path ] = icon.icon;
        hash[icon.iconName] = {
          width,
          height,
          path,
          set
        }
      }
      return hash;
    },
    { }
  )
}

