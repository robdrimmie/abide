"use strict";

const util = require('util');
const nconf = require('nconf');
const slack = require('slack');

nconf.file('./config.json');

let bot = slack.rtm.client();
let token = nconf.get("slack:token");

bot.hello(message=> {
  console.log(util.inspect(message));
})

bot.message(message=> {
  console.log(util.inspect(message));
})

bot.listen({token});

console.log();
