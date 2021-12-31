# darblast.js

## Building

Installing dependencies:

```sh
npm i
```

Building just the output JS files:

```sh
gulp default
```

Including the docs (in the `doc` directory):

```sh
gulp all
```

## Testing

```sh
gulp test
```

## Debugging

All tests are in the `test` directory. Add a `debugger` statement to the test
you want to debug, open [`chrome://inspect`](`chrome://inspect`) in Chrome, then
run:

```sh
npm --node-options --inspect test
```
