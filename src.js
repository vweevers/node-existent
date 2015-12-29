'use strict';

const fs = require('fs')
    , path = require('path')
    , after = require('after')

function existent(paths, base, done) {
  if (typeof base === 'function') done = base, base = []
  else base = base == null ? [] : [].concat(base)

  paths = [].concat(paths)

  const missing = []
      , existing = []
      , fn = typeof fs.access === 'function' ? fs.access : fs.stat

  const next = after(paths.length, () => {
    const n = missing.length

    if (n === 0) done(null, missing, existing)
    else done(error(missing, n), missing, existing)
  })

  paths.forEach(p => {
    const resolved = path.resolve(...base, p)

    fn(resolved, (err) => {
      ;(err ? missing : existing).push(resolved)
      next()
    })
  })
}

existent.sync = function(paths, base = []) {
  paths = [].concat(paths)
  base = [].concat(base)

  const fn = typeof fs.accessSync === 'function' ? fs.accessSync : fs.statSync

  for(let i=paths.length; i--;) {
    try {
      fn(path.resolve(...base, paths[i]))
    } catch (_) {
      return false
    }
  }

  return true
}

existent.assert = function(paths, base = []) {
  const original = paths

  paths = [].concat(paths)
  base = [].concat(base)

  const fn = typeof fs.accessSync === 'function' ? fs.accessSync : fs.statSync
      , missing = []

  for(let i=0, l=paths.length; i<l; i++) {
    const resolved = path.resolve(...base, paths[i])

    try {
      fn(resolved)
    } catch (_) {
      missing.push(resolved)
    }
  }

  const n = missing.length
  if (n > 0) throw error(missing, n)

  return original
}

function error(missing, n) {
  const prefix = n === 1 ? 'File does' : `${n} files do`
      , message = `${prefix} not exist: ${missing.join(', ')}`
      , err = new Error(message)

  err.missing = missing
  return err
}

module.exports = existent
