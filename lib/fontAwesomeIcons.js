import * as solid   from '@fortawesome/free-solid-svg-icons'
import * as regular from '@fortawesome/free-regular-svg-icons'
import * as brands  from '@fortawesome/free-brands-svg-icons'

export const faIcons = {
  solid,
  regular,
  brands
}

export function extractFaIconSets(iconSets=faIcons) {
  // iterate over the sets of FA icons passed and extract the pertinent data
  return Object.entries(iconSets).reduce(
    (hash, [set, icons]) => {
      hash[set] = extractFaIcons(icons)
      return hash
    },
    { }
  )
}

export function extractFaIcons(icons) {
  return Object.values(icons).reduce(
    (hash, icon) => {
      if (icon.icon) {
        const [ width, height, , , path ] = icon.icon;
        hash[icon.iconName] = {
          width,
          height,
          path,
        }
      }
      return hash;
    },
    { }
  )
}

export default faIcons
