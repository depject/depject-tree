
var N = require('libnested')

function toDot(a, b, name) {
  name = name || ''
  var s = ''
  function log () {
    var args = [].slice.call(arguments)
    s += args.join(' ') + '\n'
  }

  log('digraph ' + (name || 'depject') + ' {')

  var added = {}
  function add (string) {
    if(!added[string]) {
      added[string] = true
      log(string)
    }
  }

  for(var k in b) log('  ', dot(k), '[label='+dot(k)+', shape="box"]')
  for(var k in a) if(k) log('  ', dot(k), '[label='+dot(k)+']')

  for(var k in a)
    for(var i = 0; i < a[k].length; i++)
      if(k && a[k][i])
        add(dot(k)+'->'+dot(a[k][i]))

  for(var k in b)
    for(var i = 0; i < b[k].length; i++)
      if(k && b[k][i])
        add(dot(k)+'->'+dot(b[k][i]))

  log('}')

  return s
}

function dot (s) {
  return JSON.stringify(s)
}

function toGraph(deps) {
  var files = {}
  var apis = {}
  for(var k in deps) {
    if(deps[k] && deps[k].gives) {
      deps[k] = deps[k].gives
    }
  }
  N.each(deps, function (v, path) {
    var file = path[0]
    var api = path.slice(1).join('.')
    if(api)
      ;(files[file] = files[file] || []).push(api)

    if(v) v.forEach(function (_file) {
      ;(apis[api] = apis[api] || []).push(_file)
    })
  })

  return toDot(apis, files)
}

function toLabeledGraph (deps, name) {
  var s = ''
  function log () {
    var args = [].slice.call(arguments)
    s += args.join(' ') + '\n'
  }

  var graph = {}
  var nodes = {}
  for(var k in deps) {
    if(deps[k] && deps[k].gives) {
      deps[k] = deps[k].gives
    }
  }
  N.each(deps, function (v, path) {
    var file = path[0]
    var api = path.slice(1).join('.')
    if(v) {
      v.forEach(function (used) {
        nodes[file] = true
        nodes[used] = true
        nodes[api] = false
        N.set(graph, [file, api, used], true)
      })
    }
  })

  console.error(JSON.stringify(graph, null, 2))

  var added = {}
  function add (string) {
    if(!added[string]) {
      added[string] = true
      log(string)
    }
  }

  log('digraph ' + (name || 'depject') + ' {')

  for(var k in nodes) {
    if(nodes[k])
      log('  ', dot(k), '[label='+dot(k)+', shape="box"]')
    else
      log('  ', dot(k), '[label='+dot(k)+']') //apis
  }

  for(var k in graph) {
    for(var j in graph[k]) {
      add(dot(k)+'->'+dot(j))
    }
  }

  for(var k in graph) {
    for(var j in graph[k]) {
      for(var l in graph[k][j])
        add(dot(j)+'->'+dot(l))
    }
  }


  log('}')

  return s
}

if(!module.parent) {
  var dirs = process.argv.slice(2)
  if(!dirs.length) dirs = [process.cwd()]
  var log = console.log

  console.log = function () {}
  log(toLabeledGraph(require('./')(dirs)))
//  log(module.exports(require('./')(dirs)))
  process.exit(0)
}



