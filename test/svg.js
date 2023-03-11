import test from 'ava';
import SVGParser from '../lib/SVGParser.js';

const parser = new SVGParser();

test(
  'SVG with width and height',
  t => {
    const data = parser.parseSVGText(
      `<svg width="100" height="200">
        <path d="M1,2C3,4"/>
      </svg>`
    )
    t.is(data.width, 100);
    t.is(data.height, 200);
  }
);

test(
  'SVG with width and height in px',
  t => {
    const data = parser.parseSVGText(
      `<svg width="101px" height="201px">
        <path d="M1,2C3,4"/>
      </svg>`
    )
    t.is(data.width, 101);
    t.is(data.height, 201);
  }
);

test(
  'SVG with width and height in viewBox',
  t => {
    const data = parser.parseSVGText(
      `<svg width="100%" height="100%" viewBox="0 0 200 300">
        <path d="M1,2C3,4"/>
      </svg>`
    )
    t.is(data.width, 200);
    t.is(data.height, 300);
  }
);

test(
  'SVG with none',
  t => t.throws(
    () => {
      const data = parser.parseSVGText(
        `<svg blah="blah">
          <path d="M1,2C3,4"/>
        </svg>`,
        'example3'
      )

    },
    { message: "Can't find width and height (or viewBox) in example3"}
  )
);
