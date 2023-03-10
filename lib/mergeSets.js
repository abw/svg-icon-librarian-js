// we can have selectIcons which includes some sets to select from
//   e.g. { sets: { foo: [f1, f2], bar: [b1, b2] } }
// and configFile data which include some sets to select from
//   e.g. { sets: { foo: [f3], baz: [b3] } }
// and we need to combine to
//   e.g. { sets: { foo: [f1, f2, f3], bar: [b1, b2], baz: [b3] } }
export function mergeSelectedIconSets(...sets) {
  let merged = { };
  sets.forEach(
    set => {
      Object.entries(set).forEach(
        ([setName, selectIcons]) => {
          let mergedSet = merged[setName] ||= [ ];
          mergedSet.push(...selectIcons)
        }
      )
    }
  )
  return merged;
}

export default mergeSelectedIconSets
