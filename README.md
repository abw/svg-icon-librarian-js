# SVG Icon Librarian

This module can be used to create a library of SVG icons.  The library is a
Javascript file which can be imported into any framework or vanilla Javascript
code base.  It contains the raw data extracted from source icons that you can
then use to display in `svg` elements.

It was originally designed as a lightweight replacement for the
[@fortawesome/fontawesome-svg-core](https://www.npmjs.com/package/@fortawesome/fontawesome-svg-core)
module.  FontAwesome is awesome, and this isn't in any way suggesting that
it isn't as awesome as it ever was.  But I had some problems getting it to
work with Static Site Generation (SSG) in a Next.js project and that led me
down the path to writing this module.

The librarian can extract icons from the free FontAwesome icon sets (`solid`,
`regular` and `brands`) so that you can build your own icon library that only
contains the icons that you need.

It also allows you to define your own custom SVG icons which are added into
the library.  You can add SVG files to a directory, run the
[svg-icon-librarian.js](bin/svg-icon-librarian.js)
script, and it will take care of the rest.

It supports icons with multiple paths, style attributes and opacity, allowing
you to include duotone icons and other icons with transparent elements or
complex intersecting paths.

## Getting Started

Clone the [github repository](https://github.com/abw/svg-icon-librarian-js):

```bash
git clone https://github.com/abw/svg-icon-librarian-js.git
```

Install the dependencies using your favourite package manager.  My favourite
package manager is [pnpm](https://pnpm.io/) but `npm` or `yarn` should work
equally well.

```bash
pnpm install
```

## Try Out the Examples

The [examples](examples) directory contains a number of examples.

## Configuration File Format

You'll need to define a configuration file to specify which icons you want to
include in your library.  This can be a `.yaml` or `.json` file.

We're using YAML here so we can embed some comments for readability.

```yaml
sets:
  # icons to import from FontAwesome solid free set
  solid:
    - angle-left
    - angle-right
    - angle-down
    - angle-up
    - arrow-up
    - arrow-down
  # icons to import from FontAwesome regular free set
  regular:
    - circle
    - circle-dot
    - face-frown
    - square
  # icons to import from FontAwesome brands free set
  brands:
    - github
  # Import all custom icons
  custom: '*'

# define your own icon names mapped to any icons from the solid, regular,
# brands or your custom icon sets
icons:
  ok:           solid:circle-check
  frown:        regular:face-frown
  square:       regular:square
  badgertastic: custom:badger-duo
```

The `sets` section allows you to specify the names of the `solid`,
`regular` and `brands` icons to be imported from the corresponding
FontAwesome sets.  In this case they will be given the same icon name
in your icon library as the source (e.g. `angle-left`, `angle-right`, etc).

The `custom` set comprises all the `.svg` files that are read from the `custom`
icon directory.  The icons should be specified without the `.svg` extension,
e.g. the `badger-duo.svg` file has the icon name `badger-duo`.  You can
explicitly list out the `custom` icons that you want to import.  Or if you
want to import all the icons from the `custom` set, or any other set, then
specify `*` for the set.

If you're using a directory of custom SVG icons then you don't have to name
it `custom`.  There's an option to specify any directory you like.  Note that
when the icons are imported they will be defined in an icon set with the same
name as the directory.  So if your icon directory is named `my-project` then the
icon set containing those icons will be called `my-project`.

```yaml
sets:
  # Import all icons from the badgers directory
  my-project: '*'
```

The `icons` section allows you to define your own names for icons.  In this
example, the generated library will contain an `ok` item sourced from the
`circle-check` icon in the `solid` set, a `frown` item source from `face-frown`
in the `regular` set and so on.

## Build the Icon Library

To build the icon library run the following command from the module directory.

```bash
bin/svg-icon-librarian.js \
  -f example/icons.yaml \
  -c example/custom \
  -o example/lib/icons.js \
  -y
```

This will read the icon selection from `example/icons.yaml` (the `-f` option),
use the `example/custom` directory to source SVG files for the `custom` icon
set (the `-c` option) and write the icon library to the `example/lib/icons.js`
file (the `-o` option).

The `-y` option is short-hand for "yes", telling the script to just get on and
do it without prompting you to confirm any of the values.

You can run the script with the `-h` option to see help on all the commands.

```bash
$ bin/svg-icon-librarian.js -h
Usage: svg-icon-librarian.js [options]

Generates a library of SVG icons.

Options:
  -V, --version        output the version number
  -y, --yes            Accept default answers
  -v, --verbose        Verbose output
  -q, --quiet          Quiet output
  -f, --file <text>    Configuration file
  -c, --custom <text>  Custom directory
  -o, --output <text>  Output file
  -h, --help           display help for command
```

Instead of using command line arguments you can just run the script and it
will prompt you to enter the configuration options.

```bash
$ ../bin/svg-icon-librarian.js
✔ Where is the configuration file? … example/icons.yaml
✔ Where is the directory of custom SVG icons? … example/custom
✔ Where should the output file be written? … example/lib/icons.js
✓ Wrote icon library to lib/icons.js
```

## Generated Icon Library

The generated library (`example/lib/icons.js` in this example) contains a
named export `iconSets` which contains the definitions of the icons in
different sets.

```js
export const iconSets = {
  "solid": {
    "angle-left": {
      "width": 256,
      "height": 512,
      "path": "M9.4 233.4c-12.5 12.5-12.5 32.8 ...etc..."
    },
    "angle-right": {
      "width": 256,
      "height": 512,
      "path": "M246.6 233.4c12.5 12.5 12.5 32.8 ...etc..."
    },
    // ..etc...
  }
}
```

It then defines the `icons` named export (which is also the `default export`)
which maps your chosen icon names to those sources.

```js
export const icons = {
  "angle-left": iconSets["solid"]["angle-left"],
  "angle-right": iconSets["solid"]["angle-right"],
}
```

The reason for this indirection is that it allows you to create multiple
aliases to the same icon definition.  It also makes it possible to build
new icons sets on top of existing ones.

All icons define the `width` and `height`.  This is taken from the `viewBox`
in the original SVG file, or the `width` and `height` attributes if there
isn't a `viewBox` attribute.

For simple icons (including all those from FontAwesome), the `path` will be
defined as a string of SVG path data.

## Rendering an Icon

You can generate an `svg` element in a web page using the data defined in the
libary. You just need to create an `svg` element with a `path` element inside
it.  For example, a *very simple* React component might look something like this:

```jsx
import React from 'react'
import icons from '.../path/to/your/generated/icons.js'

const Icon = ({name, ...props}) => {
  const icon = icons[name];
  if (! icon) {
    console.log(`Invalid icon name:${name}`);
    return;
  }
  return (
    <svg
      className="svg-inline--fa"
      aria-hidden="true" focusable="false"
      role="img" xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${icon.width} ${icon.height}`}
    >
      <path d={icon.path} fill="currentColor"/>
    </svg>
  )
}

export default Icon
```

And you would use it like so:

```jsx
import React from 'react'
import Icon from '.../path/to/the/above/Icon.jsx'

const YourComponent = () =>
  <Icon name="badger"/>

export default YourComponent;
```

You'll need to include the FontAwesome CSS file in your web site, or add it
into your main stylesheet.  The CSS file for FontAwesome version 6.3.0 is
included as [styles/fontAwesome.css](https://github.com/abw/svg-icon-librarian-js/blob/master/styles/fontAwesome.css)
but you may want to check their repository to see if there's a more recent
version: https://github.com/FortAwesome/Font-Awesome/blob/6.x/css/svg-with-js.css

## Multi Path and Styled Icons

The library supports icons that have multiple paths, style attributes (on
both the `svg` element and any `path` elements) and `opacity`.  This isn't the
case for FontAwesome icons (at least not those in the solid and regular sets)
but you might want to include your own custom icons that do.

If the `svg` element has a `style` attribute then it will be included in the
icon definition in the library.

```js
export const iconSources = {
  "icon-with-style": {
    "width": 256,
    "height": 512,
    "style": "fill-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2",
    "path": "M9.4 233.4c-12.5...etc..."
  },
  // ...etc...
}
```

If the `path` has a `style` or `opacity` attribute then the `path` will be an
object containing the `d` (path data) and `style` and/or `opacity` properties.
The `opacity` might also be defined as part of the `style` attribute, e.g.
`fill-opacity: 0.15`.

```js
export const iconSources = {
  "icon-with-stylish-path": {
    "width": 256,
    "height": 512,
    "path": {
      "d": "M9.4 233.4c-12.5...etc...",
      "style": "fill-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2",
      "opacity": "0.5",
    }
  },
  // ...etc...
}
```

If the icon has multiple paths then the `paths` property will be defined as
an array of paths.  Each path can either be a string containing the path
data, or an object as described above.

```js
export const iconSources = {
  "icon-with-multiple-paths": {
    "width": 256,
    "height": 512,
    "paths": [
      // path with data and style
      {
        "d": "M9.4 233.4c-12.5...etc...",
        "style": "fill-opacity:0.15;"
      },
      // path that is just data
      "M101.675,0C102.276,0 102.873,0.004 103.479,0.011C149.73",
    ]
  },
  // ...etc...
}
```

If you're using icons like this then you'll need to code your display
components accordingly.  It should handle either a `path` or `paths`, and
each `path` can be a string or an object.

I suspect this will come back to bite me one day, but it seemed sensible to
try and optimise the size of the library as much as possible at the cost
of making the display component slightly more complicated.

## Integrating Into Your Own Project

You might want to integrate the module into your code base so you can automate
the process of building your icon library.

Add the module as a `devDependency`.

```bash
pnpm add -D @abw/svg-icon-librarian
```

You can then add a command to the `scripts` section of your `package.json`
file, something like this:

```json
  "scripts": {
    "icons": "svg-icon-librarian.js -f icons/config.yaml -c icons/custom -o lib/configicons.js -y"
  }
```

## Writing Your Own Wrapper Code

The module exports a `commandLine()` function which provides the
implementation for  the
[bin/svg-icon-librarian.js](https://github.com/abw/svg-icon-librarian-js/blob/master/bin/svg-icon-librarian.js)
script.  You can write your own wrapper script if you like.

```js
import { commandLine } from '@abw/svg-icon-libarian';

async function main() {
  await commandLine();
}

main();
```

However you probably don't want or need to deal with all the command line
options as your configuration file, custom icons and output directories are
probable fixed.

In that case you can use the `SVGIconLibrarian` class to cut to the chase.
It implements a `buildLibrary()` method which accepts a number of parameters.
The most important of those are `selectIcons` for the icon selection criteria,
`customDir` as a path to the custom icons directory and `outputFile` as a
path to where the icon library should be written.

An all-in-one script might look something like this:

```js
import SVGIconLibrarian from '@abw/svg-icon-librarian'

const customDir   = 'path/to/custom-icons';
const outputFile  = 'path/to/icons.js';
const selectIcons = {
  sets: {
    // icons to import from FontAwesome solid free set
    solid: [
      'angle-left', 'angle-right', 'angle-down', 'angle-up',
      'arrow-up', 'arrow-down',
    ],
    // icons to import from FontAwesome regular free set
    regular: [
      'circle', 'circle-dot', 'face-frown', 'square',
    ],
    custom: '*'
  },
  icons: {
    ok: 'solid:circle-check'
  }
};

async function main() {
  try {
    const librarian = new SVGIconLibrarian();
    const outfile = await SVGIconLibrarian({
      selectIcons, customDir, outputFile
    });
    console.log("Icon library written to", outfile);
  }
  catch (error) {
    console.log("ERROR:", error.message);
  }
}

main();
```

## Author

Andy Wardley https://github.com/abw
