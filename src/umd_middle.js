// ScriptSharp generates a file that invokes define()

var _exports_object = null;

function define(name, deps, factory) {
  _exports_object = factory(ss);
  _exports_object.ss = ss;

  // Gross hack to get Enums.parse() and Enums.toXml() to work. See
  // wwtlib/Util.cs for the other half of this.
  _exports_object.Enums._wwtlib = _exports_object;
}
