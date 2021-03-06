# existent

**Check if one or more paths exist, promise-less.**

[![npm status](http://img.shields.io/npm/v/existent.svg?style=flat-square)](https://www.npmjs.org/package/existent) [![Travis build status](https://img.shields.io/travis/vweevers/node-existent.svg?style=flat-square&label=travis)](http://travis-ci.org/vweevers/node-existent) [![AppVeyor build status](https://img.shields.io/appveyor/ci/vweevers/node-existent.svg?style=flat-square&label=appveyor)](https://ci.appveyor.com/project/vweevers/node-existent) [![Dependency status](https://img.shields.io/david/vweevers/node-existent.svg?style=flat-square)](https://david-dm.org/vweevers/node-existent)

## examples

```js
const existent = require('existent')

existent('sheep.txt', (err, missing) => {
  console.log(err.message) // "File does not exist: /cwd/sheep.txt"
  console.log(missing) // ["/cwd/sheep.txt"]
})

// Takes an optional base path
existent(['a', '../b', 'c'], '/things', (err) => {
  if (err) throw err // "2 files do not exist: /b, /things/c"
})

// Synchronous variant (returns boolean)
existent.sync('package.json', ['node_modules', 'chalk'])

// Assertion
existent.assert(['penguin.js', 'flamingo.js'], 'lib')
```

## api

### `existent(path(s), [base], callback)`

Asynchronous variant. If `base` is provided (a string or array), it will be prepended to each `path`. The callback receives three arguments:

1. error or null
2. array of resolved missing paths
3. array of resolved existing paths

### `existent.sync(path(s), [base])`

Synchronous variant, returns a boolean.

### `existent.assert(path(s), [base])`

Throws if one or more paths do not exist.

## install

With [npm](https://npmjs.org) do:

```
npm install existent --save
```

## license

[MIT](http://opensource.org/licenses/MIT) © Vincent Weevers
