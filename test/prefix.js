import test from 'ava';
import { prefixIconSets } from '../lib/prefix.js';

const regular = {
  alpha: { width: 100, height: 101, path: 'M1 2c3 4' },
  bravo: { width: 200, height: 201, path: 'M2 3c4 5' }
}

const solid = {
  charlie: { width: 300, height: 301, path: 'M3 4c5 6' },
  delta:   { width: 400, height: 401, path: 'M4 5c6 7' }
}

const sets = {
  regular: regular,
  solid: solid,
}

const expect = {
  "regular:alpha": { width: 100, height: 101, path: 'M1 2c3 4' },
  "regular:bravo": { width: 200, height: 201, path: 'M2 3c4 5' },
  "solid:charlie": { width: 300, height: 301, path: 'M3 4c5 6' },
  "solid:delta":   { width: 400, height: 401, path: 'M4 5c6 7' }
}

test(
  'prefixIconSets',
  t => t.deepEqual(prefixIconSets(sets), expect)
);
