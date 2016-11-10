"use strict";

const util = require('util');
const nconf = require('nconf');
const slack = require('slack');

nconf.file('./config.json');

let bot = slack.rtm.client();
let token = nconf.get("slack:token");

let users = [];

let output = (name, text)=> {
    console.log( name + " said: " + text );
}

bot.hello(message=> {
  console.log(util.inspect(message));
})

bot.message(message=> {
  let name = "An unknown user";

  if( void 0 === users[message.user]) {
      slack.users.info({"token":token, "user":message.user},
      (err,data) => {
        //   console.log('looking up user');
           console.log(err);
          //console.log(data);
          users[data.user.id] = data.user;
          output(data.user.name, message.text);
      });
  } else {
      output(users[message.user].name, message.text);
  }
})

bot.listen({token});

console.log();
