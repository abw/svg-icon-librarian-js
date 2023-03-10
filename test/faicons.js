import test from 'ava';
import { extractFaIcons, extractFaIconSets } from '../lib/fontAwesomeIcons.js';

const regular = {
  faAlphaIcon: {
    prefix: 'far',
    iconName: 'alpha',
    icon: [ 100, 101, [], 'f101', 'M1 2c3 4' ]
  },
  faBravoIcon: {
    prefix: 'far',
    iconName: 'bravo',
    icon: [ 200, 201, [], 'f102', 'M2 3c4 5' ]
  },
}

const solid = {
  faCharlieIcon: {
    prefix: 'fas',
    iconName: 'charlie',
    icon: [ 300, 301, [], 'f103', 'M3 4c5 6' ]
  },
  faDeltaIcon: {
    prefix: 'fas',
    iconName: 'delta',
    icon: [ 400, 401, [], 'f104', 'M4 5c6 7' ]
  },
}

const sets = {
  regular, solid
}

const expectRegular = {
  alpha: { width: 100, height: 101, path: 'M1 2c3 4' },
  bravo: { width: 200, height: 201, path: 'M2 3c4 5' }
}

const expectSolid = {
  charlie: { width: 300, height: 301, path: 'M3 4c5 6' },
  delta:   { width: 400, height: 401, path: 'M4 5c6 7' }
}

const expectSets = {
  regular: expectRegular,
  solid: expectSolid,
}

test(
  'extract regular faIcons',
  t => t.deepEqual(extractFaIcons(regular), expectRegular)
);

test(
  'extract solid faicons',
  t => t.deepEqual(extractFaIcons(solid), expectSolid)
);

test(
  'extract sets',
  t => t.deepEqual(extractFaIconSets(sets), expectSets)
);
