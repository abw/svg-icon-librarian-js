import test from 'ava';
import mergeSelectedIconSets from '../lib/mergeSets.js';

const sets1 = {
  foo: ['foo1', 'foo2'],
  bar: ['bar1', 'bar2']
}

const sets2 = {
  foo: ['foo3'],
  baz: ['baz1']
}

const expect = {
  foo: ['foo1', 'foo2', 'foo3'],
  bar: ['bar1', 'bar2'],
  baz: ['baz1']
}

test(
  'mergeSelectedIconSets',
  t => t.deepEqual(mergeSelectedIconSets(sets1, sets2), expect)
);
