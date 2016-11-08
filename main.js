const nconf = require('nconf');
nconf.file('./config.json');

console.log(nconf.get("slack:token"));
