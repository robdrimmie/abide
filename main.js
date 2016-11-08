"use strict";

const nconf = require('nconf');
nconf.file('./config.json');

const slack = require('slack');

let bot = slack.rtm.client();
let token = nconf.get("slack:token");

bot.hello(message=> {
  console.log(`Got a message: ${message}`)
  bot.close()
})

bot.listen({token})

console.log();
