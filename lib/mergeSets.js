import { hasValue } from '@abw/badger-utils';

// Each item in superSets can define a number of sets,
// e.g { solid: [...], regular: [...] }
// We need to merge each of the sets together "cleverly" to include all
// different collection of icons in solid, regular, etc.  Note that this
// is important because FontAwesome sometimes change the names of their
// icons so we may be importing a previously generate icon library that
// used different names.

export function mergeIconSets(...superSets) {
  return superSets
    .filter( superSet => hasValue(superSet) )
    .reduce(
      (merged, superSet) => {
        Object.entries(superSet).forEach(
          ([setName, setIcons]) => {
            merged[setName] = {
              // include any icons we've already seen with the same set name
              ...(merged[setName] || { }),
              // add in the new one
              ...setIcons
            }
          }
        );
        return merged
      },
      { }
    )
}

// we can have selectIcons which includes some sets to select from
//   e.g. { sets: { foo: [f1, f2], bar: [b1, b2] } }
// and configFile data which include some sets to select from
//   e.g. { sets: { foo: [f3], baz: [b3] } }
// and we need to combine to
//   e.g. { sets: { foo: [f1, f2, f3], bar: [b1, b2], baz: [b3] } }
export function mergeSelectedIconSets(...sets) {
  let merged = { };
  sets
    .filter(
      set => hasValue(set)
    )
    .forEach(
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
