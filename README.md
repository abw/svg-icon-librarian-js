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

You can add the module to your own Javascript project to automate the process
of building your own custom icon library.

Add the module as a `devDependency` using your favourite package manager.

### npm
```bash
npm add --save-dev @abw/svg-icon-librarian
```

### pnpm
```bash
pnpm add --save-dev @abw/svg-icon-librarian
```

### yarn
```bash
yarn add --dev @abw/svg-icon-librarian
```

You can then add a command to the `scripts` section of your `package.json`
file, something like this:

```json
  "scripts": {
    "icons": "svg-icon-librarian -f icons/config.yaml -c icons/custom -o lib/configicons.js -y"
  }
```

To generate the icon libary (substitute `npm` for `yarn` or `pnpm` if that's
what you're using)

```bash
npm icons
```

## Try Out the Examples

A good way to understand how it works is to try out the examples.  For that
you should clone the [github repository](https://github.com/abw/svg-icon-librarian-js):

```bash
git clone https://github.com/abw/svg-icon-librarian-js.git
```

Then install the dependencies using your favourite package manager.

```bash
npm install   # or yarn or pnpm
```

The [examples](examples) directory contains a number of examples showing you
how the library can be used.

## Building an Icon Library

Run the [bin/svg-icon-librarian.js](bin/svg-icon-librarian.js) script to
build your own SVG icon library.

```bash
bin/svg-icon-librarian.js \
  -f /path/to/your/icons-config-file.yaml \
  -c /path/to/your/own/svg/icon/files/custom \
  -o /path/to/output/lib/icons.js \
  -y
```

The `-f` (or `--file`) option is used to specify a configuration file.  You
can use an absolute path as shown here or a path relative to your current
directory.  The `-c` (or `--custom`) option allows you to specify a directory
containing SVG icon files that you want to use as custom icons.  These will be
available to use as an icon set with the same name as the directory (`custom`
in this example).  The `-o` (or `--output`) option is used to specify where
you want the generated icon library file to be written to.  Be warned that
this will overwrite any existing file.

The `-y` (or `--yes`) option telling the script to just get on and do it
without prompting you to confirm any of the values.

You can run the script with the `-h` (or `--help`) option to see help on all
the commands.

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
✔ Where is the configuration file? … icons/config.yaml
✔ Where is the directory of custom SVG icons? … icons/custom
✔ Where should the output file be written? … lib/config/icons.js
✓ Wrote icon library to lib/config/icons.js
```

## Configuration File Format

You'll need to define a configuration file to specify which icons you want to
include in your library.  A typical configuration file is shown below.

It can be a `.yaml` or `.json` file. We're using YAML here so we can embed
some comments for readability.

```yaml
sets:
  # icons to import from FontAwesome solid free set
  solid:
    - angle-left
    - angle-right
    - angle-down
    - angle-up
  # icons to import from FontAwesome regular free set
  regular:
    - circle
    - circle-dot
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
  ring:         regular:circle
  badger2:      custom:badger-duo
```

The `sets` section allows you to specify the names of the `solid`,
`regular` and `brands` icons to be imported from the corresponding
FontAwesome sets.  In this case they will be given the same icon name
in your icon library as the source (e.g. `angle-left`, `angle-right`, etc).

```yaml
sets:
  # icons to import from FontAwesome solid free set
  solid:
    - angle-left
    - angle-right
    - angle-down
    - angle-up
  # icons to import from FontAwesome regular free set
  regular:
    - circle
    - circle-dot
  # icons to import from FontAwesome brands free set
  brands:
    - github
```

If you have specified a custom icon directory then the icons contained in
that directory will be available as an icon set of the same name as that
directory.  If the directory for your custom icons is appropriately called
`custom` then the icon set will be called `custom`.

The `custom` set (or whatever your directory is named) comprises all the
`.svg` files that are read from the that directory.  The icons should be
specified without the `.svg` extension, e.g. the `badger-duo.svg` file has
the icon name `badger-duo`.  You can explicitly list out the `custom` icons
that you want to import.  Or if you want to import all the icons from the
`custom` set, or indeed any other set, then specify `*` for the set.

```yaml
sets:
  # ...etc...
  # Import all custom icons
  custom: '*'
```

So if your custom icon directory is named `my-project` then the
icon set containing those icons will be called `my-project` instead.

```yaml
sets:
  # ...etc...
  # Import all icons from the badgers directory
  my-project: '*'
```

The `icons` section allows you to define your own names for icons. You can
create aliases for icons that you've already specified in one of the `sets`
or you can include new icons.

```yaml
# define your own icon names mapped to any icons from the solid, regular,
# brands or your custom icon sets
icons:
  ok:           solid:circle-check
  frown:        regular:face-frown
  square:       regular:square
  ring:         regular:circle
  badger2:      custom:badger-duo
```

In this example, the generated library will contain an `ok` item sourced
from the `circle-check` icon in the `solid` set, a `frown` item source from
`face-frown` in the `regular` set and so on.

## Writing Your Own Wrapper Code

The module exports a [commandLine()](lib/commandLine.js) function which
provides the implementation for  the
[bin/svg-icon-librarian.js](bin/svg-icon-librarian.js)
script.  You can write your own Javascript script to call this if you like.

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

In that case you can use the [build()](lib/build.js) function to cut to the
chase.

```js
import { build } from '@abw/svg-icon-libarian';

const configFile = 'icons/config.yaml';
const customDir  = 'icons/custom';
const outputFile = 'lib/config/icons.js';

build({ configFile, customDir, outputFile });
```

You don't need to use a config file if you would rather just define the
icons you want in that file.  In that case use the `selectIcons` option
instead of `configFile`.  The data format should be the same as for the
configuration file.

```js
import { build } from '@abw/svg-icon-librarian';

const customDir   = 'icons/custom';
const outputFile  = 'lib/config/icons.js';
const selectIcons = {
  sets: {
    solid: [
      'angle-left', 'angle-right', 'angle-down', 'angle-up'
    ],
    regular: [
      'circle', 'circle-dot',
    ],
    brands: [
      'github'
    ],
    custom: '*'
  },
  icons: {
    ok:      'solid:circle-check',
    frown:   'regular:face-frown',
    square:  'regular:square',
    ring:    'regular:circle',
    badger2: 'custom:badger-duo',
  }
};
build({ iconSets, configFile, customDir, outputFile });
```

You can also load up an existing icon set that you've already created and
include it as an icon set in your new library as the `iconSets` option.

```js
import { build } from '@abw/svg-icon-librarian';
import { iconSets } from './lib/another-icon-library.js'

const configFile = 'icons/config.yaml';
const customDir  = 'icons/custom';
const outputFile = 'lib/config/icons.js';

build({ iconSets, configFile, customDir, outputFile });
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

## Using the Icon Library

You can use the existing FontAwesome react component to render icons, but
you'll need to write a bit of wrapper code to convert the icon data format
back into what it's expecting.

Something like this:

```jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import icons from '../path/to/your/icons.js'

const Icon = ({name, ...props}) => {
  const icon = icons[name];
  if (! icon) {
    console.log(`Invalid icon name:${name}`);
    return;
  }
  const faIcon = {
    prefix: 'fas',
    iconName: name,
    icon: [
      icon.width,
      icon.height,
      [ ],
      '',
      icon.path
    ]
  }
  return <FontAwesomeIcon icon={faIcon} {...props}/>
}
```

## Creating Your Own Icon Component

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
included as [styles/fontAwesome.css](styles/fontAwesome.css)
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
export const iconSets = {
  "custom": {
    "icon-with-style": {
      "width": 256,
      "height": 512,
      "style": "fill-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2",
      "path": "M9.4 233.4c-12.5...etc..."
    },
  }
  // ...etc...
}
```

If the `path` has a `style` or `opacity` attribute then the `path` will be an
object containing the `d` (path data) and `style` and/or `opacity` properties.
The `opacity` might also be defined as part of the `style` attribute, e.g.
`fill-opacity: 0.15`.

```js
export const iconSets = {
  "custom": {
    "icon-with-stylish-path": {
      "width": 256,
      "height": 512,
      "path": {
        "d": "M9.4 233.4c-12.5...etc...",
        "style": "fill-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2",
        "opacity": "0.5",
      }
    },
  }
  // ...etc...
}
```

If the icon has multiple paths then the `paths` property will be defined as
an array of paths.  Each path can either be a string containing the path
data, or an object as described above.

```js
export const iconSets = {
  "custom": {
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
  }
  // ...etc...
}
```

If you're using icons like this then you'll need to code your display
components accordingly.  It should handle either a `path` or `paths`, and
each `path` can be a string or an object.

I suspect this will come back to bite me one day, but it seemed sensible to
try and optimise the size of the library as much as possible at the cost
of making the display component slightly more complicated.


## Author

Andy Wardley https://github.com/abw
