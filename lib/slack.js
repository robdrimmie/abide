const fetch = require("node-fetch");
const WebSocket = require('ws');

let token;
let base_url = "https://slack.com/api";

class Slack {
    constructor(config) {
        token = config.get("slack")["token"];
    }

    teamInfo() {
        let url = 'https://slack.com/api/team.info?token=' + token;

        return fetch(url)
        .then((response) => {
            return response.json();
        })
        .catch((things) => {
            console.log("AN ERROR OCCURREEDDDDDD");
            console.log(things);
            return this;
        });
    }

    primeRtm() {
        let url = 'https://slack.com/api/rtm.start?token=' + token;

        return fetch(url)
        .then((response) => {
            return response.json();
        })
        .catch((things) => {
            console.log("AN ERROR OCCURREEDDDDDD");
            console.log(things);
            return this;
        });
    }

    listen() {
        this.primeRtm()
        .then((reponseJson) => {
            console.log(responseJson);
        });
    }
}

module.exports = Slack;
