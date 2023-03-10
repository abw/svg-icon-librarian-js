import test from 'ava';
import { mergeIconSets, mergeSelectedIconSets } from '../lib/mergeSets.js';

//--------------------------------------------------------------------------
// mergeIconSets()
//--------------------------------------------------------------------------
const sets1 = {
  solid: {
    foo: 'foo',
    bar: 'bar',
    baz: 'baz',
  },
  regular: {
    square: 'square1'
  },
  just1: {
    one: 'one'
  }
}
const sets2 = {
  solid: {
    wig: 'wig',
    wam: 'wam',
    bam: 'bam'
  },
  regular: {
    square: 'square2'
  },
  just2: {
    two: 'two'
  }
}

const setsExpect = {
  solid: {
    foo: 'foo',
    bar: 'bar',
    baz: 'baz',
    wig: 'wig',
    wam: 'wam',
    bam: 'bam'
  },
  regular: {
    square: 'square2'   // sets2 version replaces sets1
  },
  just1: {
    one: 'one'
  },
  just2: {
    two: 'two'
  }
}

test(
  'mergeIconSets',
  t => t.deepEqual(
    mergeIconSets(sets1, sets2),
    setsExpect
  )
);


//--------------------------------------------------------------------------
// mergeSelectedIconSets()
//--------------------------------------------------------------------------

const selected1 = {
  foo: ['foo1', 'foo2'],
  bar: ['bar1', 'bar2']
}

const selected2 = {
  foo: ['foo3'],
  baz: ['baz1']
}

const selectedExpect = {
  foo: ['foo1', 'foo2', 'foo3'],
  bar: ['bar1', 'bar2'],
  baz: ['baz1']
}

test(
  'mergeSelectedIconSets',
  t => t.deepEqual(
    mergeSelectedIconSets(selected1, selected2),
    selectedExpect
  )
);
