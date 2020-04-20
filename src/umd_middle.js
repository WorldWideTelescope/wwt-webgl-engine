// ScriptSharp generates a file that invokes define()

var _exports_object = null;

function define(name, deps, factory) {
  _exports_object = factory(ss);
}