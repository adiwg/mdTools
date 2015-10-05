// Grab an existing namespace object, or create a blank object
// if it doesn't exist
var JSV = window.JSV || {};

JSV.Converter = require('json2csv');
JSV.Mustache = require('mustache');
JSV.codes = require('../bower_components/mdcodes/resources/json/mdcodes.json');
// Replace/Create the global namespace
window.JSV = JSV;