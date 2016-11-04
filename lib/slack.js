
const fetch = require('node-fetch');

let config;

class Slack {
    constructor(config) {
        console.log('constructing');
        this.config = config.get('slack');
    }

    do() {
        let token = this.config['token'];
        let foo = fetch('https://slack.com/api/auth.test?token=' + 'xoxp-13569967601-13570969090-99391631664-1bc7735d1feca8b77b8eb5e1900b248a')
          .then((foo) => {
              return foo.json();
          }).then(function(json) {
              console.log(json);
          });
    }
}

module.exports = Slack;
