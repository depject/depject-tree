# depject-tree

tool for showing all dependencies in a depject project (or projects)

indirection can be useful for decoupling (and thus modularity)
but this indirection can make code harder to understand if
there are no tools to show you the routes things take.

## usage

```
> npm install -g depject-tree

> depject-tree . node_modules/patchcore
... outputs json object...
```
the format is:
```
<path>: {
  "needs": {
    <api>: [<places this api is provided>],
  },
  "gives": {
    <api>: [<places this api is used>]
  }
}
```

here is a portion of the output for patchbay@6
it represents the _split_ module, which shows two or more
`screen_view`s side by side. it also _gives_ `screen_view`
which is used by the `app`, `tabs`, and `split` modules.
```
...
"modules_extra/split.js": {
  "needs": {
    "screen_view": [
      "modules_basic/invite.js",
      "modules_basic/setup.js",
      "modules_extra/blob.js",
      "modules_extra/key.js",
      "modules_extra/network.js",
      "modules_extra/query.js",
      "modules_extra/versions.js"
    ]
  },
  "gives": {
    "screen_view": [
      "modules_core/app.js",
      "modules_core/tabs.js",
      "modules_extra/split.js"
    ]
  }
},
...
```


## todo

* prettier output
* make it easy to quickly query about specific modules

## License

MIT

