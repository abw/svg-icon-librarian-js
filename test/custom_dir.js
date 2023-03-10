import test from 'ava';
import { readCustomSVGDir } from '../lib/SVGDir.js';
import { bin } from '@abw/badger';

const iconsDir   = bin(import.meta.url).dir('icons');
const animalsDir = iconsDir.dir('animals')
const shapesDir  = iconsDir.dir('shapes')
let animals, shapes;

test.serial(
  'check iconsDir exists',
  async t => {
    t.is(await iconsDir.exists(), true)
  }
);

test.serial(
  'check animals exists',
  async t => {
    t.is(await animalsDir.exists(), true)
  }
);

test.serial(
  'check shapes exists',
  async t => {
    t.is(await shapesDir.exists(), true)
  }
);

test.serial(
  'Read animals',
  async t => {
    animals = await readCustomSVGDir(animalsDir);
    t.truthy(animals)
  }
);

test.serial(
  'Read shapes',
  async t => {
    shapes = await readCustomSVGDir(shapesDir);
    t.truthy(shapes)
  }
);


test.serial(
  'pentagon',
  t => t.is(shapes.shapes.pentagon.width, 520)
);


