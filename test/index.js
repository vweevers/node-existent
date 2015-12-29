const test = require('tape')
    , existent = require('../src')
    , unixify = require('unixify')
    , path = require('path')

function resolve(...expected) {
  return expected.map(p => unixify(path.resolve(p)))
}

function msg(err) {
  const message = (err ? err.message : '').split(': ')
      , name = message[0]
      , paths = message[1].split(', ')

  return name + ': ' + paths.map(unixify).join(', ')
}

test('async', (t) => {
  t.plan(18)

  existent([], (err, missing, existing) => {
    t.notOk(err)
    t.deepEquals(missing, [])
    t.deepEquals(existing, [])
  })

  existent('src.js', (err, missing, existing) => {
    t.notOk(err)
    t.deepEquals(missing, [])
    t.deepEquals(existing.map(unixify), resolve('src.js'))
  })

  existent(['src.js', 'test/index.js'], (err, missing, existing) => {
    t.notOk(err)
    t.deepEquals(missing, [])
    t.deepEquals(existing.map(unixify), resolve('src.js', 'test/index.js'))
  })

  existent(['../src.js', 'index.js'], __dirname, (err, missing, existing) => {
    t.notOk(err)
    t.deepEquals(missing, [])
    t.deepEquals(existing.map(unixify), resolve(__dirname+'/../src.js', __dirname+'/index.js'))
  })

  existent(['src.js', 'nope'], (err, missing, existing) => {
    t.equals(msg(err), 'File does not exist: ' + resolve('nope'))
    t.deepEquals(missing.map(unixify), resolve('nope'))
    t.deepEquals(existing.map(unixify), resolve('src.js'))
  })

  existent(['a', 'b'], (err, missing, existing) => {
    t.equals(msg(err), '2 files do not exist: ' + resolve('a') + ', ' + resolve('b'))
    t.deepEquals(missing.map(unixify), resolve('a', 'b'))
    t.deepEquals(existing, [])
  })
})

test('sync', (t) => {
  t.plan(10)

  t.ok(existent.sync([]))
  t.ok(existent.sync('src.js'))
  t.ok(existent.sync('index.js', 'test'))
  t.ok(existent.sync(['src.js']))
  t.ok(existent.sync(['src.js', 'readme.md']))
  t.ok(existent.sync(['src.js', 'readme.md'], [__dirname, '..']))

  t.notOk(existent.sync(['src.js', 'readme500.md']))
  t.notOk(existent.sync(['readme500.md']))
  t.notOk(existent.sync('readme500.md'))
  t.notOk(existent.sync('readme.md', 'foo'))
})

test('assert', (t) => {
  t.plan(10)

  function ok(paths, base, ret) {
    try {
      ret = existent.assert(paths, base)
    } catch(err) {
      return t.fail(err)
    }

    t.ok(ret === paths)
  }

  ok([])
  ok('src.js')
  ok('index.js', 'test')
  ok(['src.js'])
  ok(['src.js', 'readme.md'])
  ok(['src.js', 'readme.md'], [__dirname, '..'])

  t.throws(() => existent.assert(['src.js', 'readme500.md']))
  t.throws(() => existent.assert(['readme500.md']))
  t.throws(() => existent.assert('readme500.md'))
  t.throws(() => existent.assert('readme.md', 'foo'))
})
