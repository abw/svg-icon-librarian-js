export function  rebaseConfig(params) {
  const baseIcons   = params.baseIcons;
  const selectIcons = params.selectIcons || { };
  const iconSets    = params.iconSets || { };
  let   sets        = { }
  let   icons       = { }

  // If we have any baseIcons defined as an object mapping icon set names
  // to icon definitions, e.g. { badger: { a: ..., b: ... }}
  // then we need to add those base sets to the iconSets configuration
  // item, being careful to also include anything already defined in
  // iconSets.  Then we need to add entries to selectIcons.icons to
  // select each of those icons by their new names with the prefix,
  // e.g. { a: 'badger:a', b: 'badger:b' }
  Object.entries(baseIcons).forEach(
    ([setName, setIcons]) => {
      sets[setName] = setIcons;
      Object.entries(setIcons).forEach(
        ([iconName]) => {
          icons[iconName] = `${setName}:${iconName}`;
        },
      )
    }
  )
  return {
    ...params,
    iconSets: {
      ...sets,
      ...iconSets
    },
    selectIcons: {
      ...selectIcons,
      icons: { ...icons, ...(selectIcons.icons || { }) }
    }
  }
}

export default rebaseConfig