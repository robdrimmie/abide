"use strict";

const util = require('util');
const slack = require('slack');


class Listener {
    constructor(token) {
        this.teams = [];
        this.channels = [];
        this.users = [];

        this.token = token;

        this.bot = this.setupBot()
    }

    setupBot() {
        let bot = slack.rtm.client();

        bot.message(message=> {
          message.output = {};

          Promise.resolve(message)
          .then(this.resolveTeam.bind(this))
          .then(this.resolveChannel.bind(this))
          .then(this.resolveUser.bind(this))
          .then(this.resolveTimestamp.bind(this))
          .then(this.resolveText.bind(this))
          .then(this.resolveOutput.bind(this))
          .catch((error) => {
            console.error(error.stack);
          });
        })

        return bot;
    }

    listen() {
        this.bot.listen({"token":this.token});
    }

    resolveTeam(promise) {
        let output = promise.output;

        if (this.teams[promise.team]) {
            output.team = this.teams[promise.team];
            promise.output = output;

            return promise;
        }

        let returnMe = function(resolve,reject) {
          slack.team.info({"token":this.token, "team":promise.team}, (err,data) => {
            if (err) {
              throw err;
            }

            this.teams[data.team.id] = data.team;

            output.team = this.teams[data.team.id];
            promise.output = output;

            resolve(promise);
          });
        }

        return new Promise(returnMe.bind(this));

        throw new Error('resolve team did not return anything');
    }

    resolveChannel(promise) {
        let output = promise.output;

        if (this.channels[promise.channel]) {
            output.channel = this.channels[promise.channel];
            promise.output = output;

            return promise;
        }

        let returnMe = function(resolve,reject) {
          slack.channels.info({"token":this.token, "channel":promise.channel}, (err,data) => {
            let channelId;
            if (err) {
                if ('channel_not_found' === err) {
                  channelId = promise.channel.id;
                  this.channels[channelId] = {"name":"Unknown or DM"};
                } else {
                  throw (err);
                }
            } else {
              channelId = data.channel.id;
              this.channels[channelId] = data.channel;
            }

            output.channel = this.channels[channelId];
            promise.output = output;

            resolve(promise);
          });
        }

        return new Promise( returnMe.bind(this) );

        throw new Error('resolve channel did not return anything');
    }

    resolveUser(promise) {
        let output = promise.output;

        if (this.users[promise.user]) {
            output.user = this.channels[promise.user];
            promise.output = output;

            return promise;
        }

        let returnMe = function(resolve,reject) {
          slack.users.info({"token":this.token, "user":promise.user}, (err,data) => {
            if (err) {
              throw err;
            }

            this.users[data.user.id] = data.user;

            output.user = this.users[data.user.id];
            promise.output = output;

            resolve(promise);
          });
        }

        return new Promise( returnMe.bind(this) );

        throw new Error('resolve user did not return anything');
    }

    resolveTimestamp(promise) {
        let output = promise.output;

        output.timestamp = promise.ts;
        promise.output = output;

        return promise;
    }

    resolveText(promise) {
        let output = promise.output;

        output.text = promise.text;
        promise.output = output;

        return promise;
    }

    resolveOutput(promise) {
        let output = "";
        output += "[" + promise.output.team.name + "|" + promise.output.channel.name + "|" + promise.output.timestamp +"]\n";
        output += promise.output.user.name + " said: " + promise.output.text;
        console.log(output);

        return promise;
    }
}

module.exports = Listener;
