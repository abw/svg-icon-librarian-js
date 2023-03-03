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

The librarian can extract icons from the solid and regular FontAwesome free
icon sets so that you can build your own icon library that only contains the
icons that you need.

It also allows you to define your own custom SVG icons which are added into
the library.  You can add SVG files to a directory, run the
[svg-icon-librarian.js](https://github.com/abw/svg-icon-librarian-js/blob/master/bin/svg-icon-librarian.js)
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

## Try Out the Example

The [example](https://github.com/abw/svg-icon-librarian-js/tree/master/example)
directory contains a sample [icons.yaml](https://github.com/abw/svg-icon-librarian-js/blob/master/example/icons.yaml)
file.  This include the names of the `solid` and `regular` icons to be imported
from the corresponding FontAwesome sets.  You can use a `.json` file if you
prefer.

```yaml
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
```

The `alias` section allows you to define your own names for icons.

```yaml
# icon aliases from either solid, regular or your custom icon sets
alias:
  ok: solid:circle-check
```

In this example we define an icon called `ok` which is an alias for the
`circle-check` icon in the `solid` set.

The `custom` directory contains some custom SVG icons.  They will be added
to the icon library using their file names (without the `.svg` extension).
If you want to create an alias to a custom icon then use the `custom` icon
set.

```yaml
# icon aliases from either solid, regular or your custom icon sets
alias:
  animal: custom:badger-duo

```

## Build an Icon Library

To build the icon library run the following commands.

```bash
cd example
../bin/svg-icon-librarian.js -f icons.yaml -c custom -o lib/icons.js -y
```

This will write the icon library to the `lib/icons.js` file.

Instead of using command line arguments you can just run the script and it
will prompt you to enter the configuration options.

```bash
$ ../bin/svg-icon-librarian.js
✔ Where is the configuration file? … icons.yaml
✔ Where is the directory of custom SVG icons? … custom
✔ Where should the output file be written? … lib/icons.js
✓ Wrote icon library to lib/icons.js
```

The generated library (`lib/icons.js` in this example) contains a named export
`iconLibrary` (this is also the default export) which maps the icon names to
the relevant data.

```js
export const iconLibrary = {
  "angle-left": {
    "width": 256,
    "height": 512,
    "path": "M9.4 233.4c-12.5...etc..."
  },
  // ...etc...
}
```

All icons define the `width` and `height`.  This is taken from the `viewBox`
in the original SVG file, or the `width` and `height` attributes if there
isn't a `viewBox` attribute.

For simple icons (including all those from FontAwesome), the `path` will be
defined.

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
export const iconLibrary = {
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
export const iconLibrary = {
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
export const iconLibrary = {
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

## Selection Data

The generated library file also contains an `iconSelection` definition
which lists the icons imported from each icon set.  This can be useful when
you want to build a style guide showing examples of all the available icons.

```js
export const iconSelection = {
  "solid": [
    "angle-left",
    "angle-right",
    // ...etc...

  ],
  "regular": [
    "circle",
    "circle-dot",
    // ...etc...
  ],
  "alias": {
    "ok": "solid:circle-check"
  },
  "custom": [
    "badger-duo",
    "badger"
  ]
};
```

## Author

Andy Wardley https://github.com/abw
