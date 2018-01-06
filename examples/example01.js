/**
 * Please run this example with username and password as 1st and 2nd argument. For example
 *
 *  node ./examples/example01.js smith AABBCC
 *
 * The sample codes are written in ES6 syntax. Please use nodejs 6+ or above.
 *
 */
var colors = require('colors');
var moment = require('moment');
var Client = require('..');

var ERR_EXIT = function(message, code=1) {
    console.log(message);
    return process.exit(code);
}

var LOG = function(message) {
    var now = moment();
    var time = now.format('MMM/DD HH:mm:ss.SSS').gray;
    console.log(`${time} ${message}`);
}

var opts = {}
let [lsc, entry, username, password, server] = process.argv

if (username == null) {
    return ERR_EXIT("missing username as 1st argument");
}

if (password == null) {
    return ERR_EXIT("missing password as 2nd argument");
}

if (server == null) {
    server = "https://tic-dm.t2t.io"
}

var c = new Client(server, username, password, opts, false);

c.on('connected', () => LOG("connected"));
c.on('disconnected', () => LOG("disconnected"));
c.on('authenticated', () => LOG("authenticated"));
c.on('error', (message) => ERR_EXIT(message));
c.on('peripheral_updated', function(profile, identity, p_type, p_id, version, state, metadata) {
    LOG(`${profile.gray}: ${identity.cyan}/${p_type.yellow}/${p_id.yellow}`);
    LOG(`\t\tversion:${version.green} state:${state}`);
    LOG(`\t\tmetadata => ${(JSON.stringify(metadata)).magenta}`);
});

console.log(`connecting to ${server}`);
c.connect();