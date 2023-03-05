# Examples

This directory contains a number of examples showing how to use
the SVG Icon Librarian.

## Simple Shell Script

The [build-custom](build-custom) shell script runs this command:

```bash
../bin/svg-icon-librarian.js \
    -f config/icons.yaml \
    -c icons/custom \
    -o lib/icons.js \
    -y
```

It uses the [config/icons.yaml](config/icons.yaml) configuration file to
select icons from the FontAwesome `solid`, `regular` and `brands` icon sets.
It also imports custom icons from the [icons/custom](icons/custom) directory
which are then available to specify in [config/icons.yaml](config/icons.yaml)
as the `custom` icon set.  It writes the generated library to `lib/icons.js`.

## Javascript Builder

The [badger.js](badger.js) script shows how the [build()](../lib/build.js)
function can be used to build a library from a Javascript file.

```bash
./badger.js
```

It is the Javascript equivalent of running this command:

```bash
../bin/svg-icon-librarian.js \
    -f config/badger.yaml \
    -c icons/badger \
    -o lib/badger.js \
    -y
```

It uses the [config/badger.yaml](config/badger.yaml) configuration file and
custom icons in [icons/badger](icons/badger) to generate the `lib/badger.js`
library.

## Merging Custom Icon Sets

The [merged.js](merged.js) script shows how the `lib/badger.js` library
generated in the previous step can then be included as an additional icon set.
It uses the [config/merged.yaml](config/merged.yaml) configuration file, the
custom icons in [icons/custom](icons/custom) in addition to those from the
`badger` icon set, and generates the `lib/merged.js` icon library.

```bash
./merged.js
```

