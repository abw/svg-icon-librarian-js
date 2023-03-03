# SVG Icon Librarian

This module can be used to create a library of SVG icons.

It was originally designed as a lightweight replacement for the
[@fortawesome/fontawesome-svg-core](https://www.npmjs.com/package/@fortawesome/fontawesome-svg-core)
module.  FontAwesome is awesome, and this isn't in any way suggesting that
it isn't as awesome as it ever was.  But I had some problems getting it to
work with Static Site Generation (SSG) in a Next.js and that led me down the
path to writing this module.

The librarian can extract icons from the solid and regular FontAwesome free
icon sets so that you can build your own icon library that only contains the
icons that you need.

It allows you to define your own custom SVG icons which are added into the
library.  You can add them to a directory, run the script, and it will take
care of the rest.

It supports icons with multiple paths, style attributes and opacity, allowing
you to include duotone and other icons with transparent elements.

## Getting Started

Install the module using your favourite package manager.

```bash
npm add @abw/svg-icon-librarian
```

If you want to use FontAwesome icons, either from the solid and/or regular
sets then you'll need to install them too.

```bash
npm add @fortawesome/free-solid-svg-icons @fortawesome/free-regular-svg-icons
```

TODO: other dependencies?

