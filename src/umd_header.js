/* AAS WorldWide Telescope WebGL engine */
/* eslint-disable */
/* (this file ends up so big that eslint takes ~forever to run on it) */
/* Licensed under the MIT License. */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.wwtlib = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

// (umd_header.js intentionally incomplete -- it is concatenated to form index.js)