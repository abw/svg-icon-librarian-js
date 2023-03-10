import test from 'ava';
import rebaseConfig from '../lib/rebaseConfig.js';

const baseIcons = {
  badger: {
    badger1: 'badger1-icon',
    badger2: 'badger2-icon'
  },
  bodger: {
    bodger1: 'bodger1-icon',
    bodger2: 'bodger2-icon'
  }
}
const selectIcons = {
  sets: {
    badger: ['badger1'],
    bodger: '*',
    solid:  ['food']
  },
  icons: {
    animal: 'bodger:bodger2'
  }
}
const iconSets = {
  solid: {
    food: 'solid-food'
  }
}

const expect = {
  iconSets: {
    badger: {
      badger1: 'badger1-icon',
      badger2: 'badger2-icon'
    },
    bodger: {
      bodger1: 'bodger1-icon',
      bodger2: 'bodger2-icon'
    },
    solid: {
      food: 'solid-food'
    }
  },
  selectIcons: {
    sets: {
      badger: ['badger1'],
      bodger: '*',
      solid:  ['food']
    },
    icons: {
      badger1: 'badger:badger1',
      badger2: 'badger:badger2',
      bodger1: 'bodger:bodger1',
      bodger2: 'bodger:bodger2',
      animal: 'bodger:bodger2'
    }
  },
  baseIcons,
}

//const result = rebaseConfig({ iconSets, baseIcons, selectIcons })
//console.log('result:', result);

test(
  'rebaseConfig',
  t => t.deepEqual(
    rebaseConfig({ iconSets, baseIcons, selectIcons }),
    expect
  )
);
