
var N = require('libnested')
module.exports = function (deps) {
  var files = {}
  var apis = {}
  for(var k in deps) {
    if(deps[k] && deps[k].gives)
      delete deps[k].gives
  }
  N.each(deps, function (v, path) {
    var file = path[0]
    var api = path.slice(2).join('.')
    if(api)
      ;(files[file] = files[file] || []).push(api)

    if(file)
      ;(apis[api] = apis[api] || []).push(file)
    
  })

  return toDot(apis, files)
}

function dot (s) {
  return s.replace('.js', '_JS').replace(/-/g, '_').replace(/\.|\//g, '_')
}

function toDot(a, b, name) {
  name = name || ''
  var s = ''
  function log () {
    var args = [].slice.call(arguments)
    s += args.join(' ') + '\n'
  }

  log('digraph ' + (name || 'depject') + ' {')

  for(var k in a) log('  ', dot(k), '[label="'+dot(k)+'"]')
  for(var k in b) log('  ', dot(k), '[label="'+dot(k)+'", shape="box"]')
  for(var k in a)
    for(var i = 0; i < a[k].length; i++)
      if(k && a[k][i])
        log(dot(k)+'->'+dot(a[k][i]))
  for(var k in b)
    for(var i = 0; i < b[k].length; i++)
      if(k && b[k][i])
        log(dot(k)+'->'+dot(b[k][i]))

  log('}')

  return s
}

if(!module.parent) {
  var dirs = process.argv.slice(2)
  if(!dirs.length) dirs = [process.cwd()]
  var log = console.log

  console.log = function () {}
  log(module.exports(require('./')(dirs)))
  process.exit(0)
}



