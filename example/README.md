# Example

Run the following command from this directory:

```bash
$ ../bin/svg-icon-librarian.js \
    -f icons.yaml \
    -c custom \
    -o lib/icons.js \
    -y
```

This uses the `icons.yaml` configuration file to select icons from the
FontAwesome solid and regular icon sets, loads up custom icons from the
`custom` directory, and writes the output to `lib/icons.js`.
