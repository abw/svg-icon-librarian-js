export function prefixIcons(prefix, icons) {
  return Object.entries(icons).reduce(
    (prefixed, [name, icon]) => {
      prefixed[`${prefix}:${name}`] = icon;
      return prefixed;
    },
    { }
  )
}

export function prefixIconSets(sets) {
  return Object.entries(sets).reduce(
    (prefixed, [set, icons]) => {
      Object.assign(prefixed, prefixIcons(set, icons));
      return prefixed;
    },
    { }
  )
}
