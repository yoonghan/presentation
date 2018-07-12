// Require Node modules in the browser thanks to Browserify: http://browserify.org
var bespoke = require('bespoke'),
  voltaire = require('bespoke-theme-voltaire'),
  backdrop = require('bespoke-backdrop'),
  keys = require('bespoke-keys'),
  touch = require('bespoke-touch'),
  classes = require('bespoke-classes'),
  bullets = require('bespoke-bullets'),
  scale = require('bespoke-scale');

// Bespoke.js
bespoke.from('article', [
  voltaire(),
  backdrop(),
  classes(),
  keys(),
  touch(),
  bullets('li, .bullet'),
  scale()
]);

// Prism syntax highlighting
// This is actually loaded from "bower_components" thanks to
// debowerify: https://github.com/eugeneware/debowerify
require('prism');
