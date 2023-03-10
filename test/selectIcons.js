import test from 'ava';
import selectIcons from '../lib/selectIcons.js';

// iconSets contains sets of icons
const iconSets = {
  solid: {
    one:   'icon-solid-one',
    two:   'icon-solid-two',
    three: 'icon-solid-three'
  },
  regular: {
    three: 'icon-regular-three',
    four:  'icon-regular-four',
    five:  'icon-regular-four'
  },
  custom: {
    ten:    'icon-custom-ten',
    eleven: 'icon-custom-eleven'    // one louder
  }
}

// select can list icons in those sets of icons as a short-hand for explicitly
// listing them all out in the icons section.  A set can also be a wildcard
// '*' to select all icons.
const select = {
  sets: {
    solid: ['one', 'two' ],
    regular: 'three four',
    custom: '*',
  },
  icons: {
    tres: 'regular:three'
  }
}

// we expect to get back the sets reduced down to only the icons that have
// been selected, and each entry in icons should be an array containing the
// set name and icon name.  All of the wildcard icons should be included.
const expect = {
  sets: {
    solid: {
      one: 'icon-solid-one',
      two: 'icon-solid-two'
    },
    regular: {
      three: 'icon-regular-three',
      four: 'icon-regular-four'
    },
    custom: {
      ten: 'icon-custom-ten',
      eleven: 'icon-custom-eleven'
    }
  },
  icons: {
    one:    [ 'solid',    'one'     ],
    two:    [ 'solid',    'two'     ],
    three:  [ 'regular',  'three'   ],
    four:   [ 'regular',  'four'    ],
    tres:   [ 'regular',  'three'   ],
    ten:    [ 'custom',   'ten'     ],
    eleven: [ 'custom',   'eleven'  ]
  }
}

test(
  'selectIcons',
  t => t.deepEqual(
    selectIcons(select, iconSets),
    expect
  )
);
