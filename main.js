"use strict";

const util = require('util');
const nconf = require('nconf');
const slack = require('slack');

nconf.file('./config.json');

let bot = slack.rtm.client();


let teams = [];
let channels = [];
let users = [];

let resolveTeam = (promise) => {
    let output = promise.output;

    if (teams[promise.team]) {
        output.team = teams[promise.team];
        promise.output = output;

        return promise;
    }

    return new Promise( function(resolve,reject) {
      slack.team.info({"token":token, "team":promise.team}, (err,data) => {
        if (err) {
          throw err;
        }

        teams[data.team.id] = data.team;

        output.team = teams[data.team.id];
        promise.output = output;

        resolve(promise);
      });
    });

    throw new Error('resolve team did not return anything');
}

let resolveChannel = (promise) => {
    let output = promise.output;

    if (channels[promise.channel]) {
        output.channel = channels[promise.channel];
        promise.output = output;

        return promise;
    }

    return new Promise( function(resolve,reject) {
      slack.channels.info({"token":token, "channel":promise.channel}, (err,data) => {
        let channelId;
        if (err) {
            if ('channel_not_found' === err) {
              channelId = promise.channel.id;
              channels[channelId] = {"name":"Unknown or DM"};
            } else {
              throw (err);
            }
        } else {
          channelId = data.channel.id;
          channels[channelId] = data.channel;
        }

        output.channel = channels[channelId];
        promise.output = output;

        resolve(promise);
      });
    });

    throw new Error('resolve channel did not return anything');
}

let resolveUser = (promise) => {
    let output = promise.output;

    if (users[promise.user]) {
        output.user = channels[promise.user];
        promise.output = output;

        return promise;
    }

    return new Promise( function(resolve,reject) {
      slack.users.info({"token":token, "user":promise.user}, (err,data) => {
        if (err) {
          throw err;
        }

        users[data.user.id] = data.user;

        output.user = users[data.user.id];
        promise.output = output;

        resolve(promise);
      });
    });

    throw new Error('resolve user did not return anything');
}

let resolveTimestamp = (promise) => {
    let output = promise.output;

    output.timestamp = promise.ts;
    promise.output = output;

    return promise;
}

let resolveText = (promise) => {
    let output = promise.output;

    output.text = promise.text;
    promise.output = output;

    return promise;
}

let resolveOutput = (promise) => {
    let output = "";
    output += "[" + promise.output.team.name + "|" + promise.output.channel.name + "|" + promise.output.timestamp +"]\n";
    output += promise.output.user.name + " said: " + promise.output.text;
    console.log(output);

    return promise;
}

bot.hello(message=> {
  console.log(util.inspect(message));
})

bot.message(message=> {
  message.output = {};
  Promise.resolve(message)
  .then(resolveTeam)
  .then(resolveChannel)
  .then(resolveUser)
  .then(resolveTimestamp)
  .then(resolveText)
  .then(resolveOutput)
  .catch((error) => {
    console.log("chain broke:");
    console.log(util.inspect(error));
  });
})

// Start it up!

let tokens = nconf.get("slack:token");
bot.listen({token});
