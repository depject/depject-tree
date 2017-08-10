#! /usr/bin/env node

var fs = require('fs')
var path = require('path')
var isDepject = require('depject/is')

function Filter (stat) {
  if(stat.name === 'node_modules') return
  if(/^\./.test(stat.name)) return
  if(stat.isDirectory()) return true
  if(/\.js$/.test(stat.name)) return true
}

function Map (stat) {
  try {
    var m = require(stat.path)
    if(isDepject(m))
      return m
  } catch (err) {
    return err.message
  }
}

function walk (dir, filter, map) {
  filter = filter || Filter
  map = map || Map
  var o = {}
  fs.readdirSync(dir)
  .forEach(function (file) {
    var filename = path.join(dir, file)
    var stat = fs.statSync(filename)
    stat.name = file
    stat.path = filename

    if(!filter(stat)) return
    if(stat.isDirectory())
      o[file] = walk(filename, filter, map)
    else
      o[file] = map(stat)
  })
  return o
}

var files = {}
var dirs = process.argv.slice(2)
if(!dirs.length) dirs = [process.cwd()]

dirs.forEach(function (dir) {
  walk(
    path.resolve(process.cwd(), dir),
    Filter,
    function (e) {
      files[e.path] = Map(e)
    }
  )
})
var _files = files; files = {}
for(var k in _files)
  files[path.relative(process.cwd(), k)] = _files[k]

var N = require('libnested')

var files = N.map(files, function (value, path) {
  var last = path[path.length - 1]
  if(path[1] == 'gives') {
    if('string' === typeof value)
      path.push(value)
//    return value
    var needed = []
    for(var k in files) {
      var m = files[k]
      if(m && m.needs && N.get(m.needs, path.slice(2)))
        needed.push(k)
    }
    return needed
  }
  else if(path[1] == 'needs') {
    var given = []
    for(var k in files) {
      var m = files[k]
      if(m && m.gives && N.get(m.gives, path.slice(2)))
        given.push(k)
    }
    return given
  }

})

console.log(JSON.stringify(files, null, 2))
process.exit(0)




