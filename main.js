"use strict";

const util = require('util');
const nconf = require('nconf');
const slack = require('slack');

const Listener = require('./lib/Listener');

nconf.file('./config.json');

// Start it up!

let tokens = nconf.get("slack:tokens");
let listeners = [];

tokens.forEach(function(token) {
    listeners[token] = new Listener(token);
    listeners[token].listen();
});
