<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Install](#install)
- [Introduction](#introduction)
- [Connection Options](#connection-options)
- [Events](#events)
    - [`connected`](#connected)
    - [`disconnected`](#disconnected)
    - [`authenticated`](#authenticated)
    - [`error`](#error)
    - [`peripheral_updated`](#peripheral_updated)
- [Example](#example)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# tic-dm-client

TIC DM Client library.


## Install

```
$ git clone https://github.com/t2t-io/tic-dm-client.git node_modules/tic-dm-client
```


## Introduction

This is a nodejs client library for TIC DM (device management) service based on [socket.io](https://socket.io). Here is an example how to use the library to connect to DM service to get the update events of peripheral objects:

```javascript
const username = 'smith';
const password = '1234';
const server = 'https://tic-dm.t2t.io';
const opts = {};
const verbose = false;
var Client = require('tic-dm-client');
var c = new Client(server, username, password, opts, verbose);

c.on('connect', () => console.log("connected"));

// The client is authenticated by server.
//
c.on('authenticated', () => console.log("authenticated"));

// Server informs client that one Peripheral object is updated.
// 
c.on('peripheral_updated', function(profile, identity, p_type, p_id, version, state, metadata) {
    console.log(`${profile}: ${identity}/${p_type}/${p_id}`);
    console.log(`\t\tversion:${version} state:${state}`);
    console.log(`\t\tmetadata => ${JSON.stringify(metadata)}`);
});

c.connect();
```

## Connection Options

```javascript
var c = new Client(server, username, password, opts, verbose);
```

- `server`, the URL of DM service, e.g. `https://tic-dm.t2t.io`
- `username`, the name of user account to login DM service
- `password`, the password of user account
- `opts`, other options. By default, it shall be `{}`
- `verbose`, `true` to enable verbose outputs in the client library.


## Events

There are several events for the client instance:

- `connected`
- `disconnected`
- `authenticated`
- `peripheral_updated`
- `error`

### `connected`

Indicate the client instance already connects to DM service.

### `disconnected`

Indicate the client instance is disconnected from DM service because of network errors. With [socket.io](https://socket.io), the client instance shall keep retrying to connect to DM service.

### `authenticated`

Indicate that server authenticates the client by its given `username` and `password`. After this event, all `perform_*` apis of client can be invoked.

### `error`

Indicate the unexpected error. The signature of callback shall be `function (message)`.

### `peripheral_updated`

Indicate one peripheral object associated with a Node in a Profile is updated. The signature of callback function shall be `function(profile, identity, p_type, p_id, version, state, metadata)`:

- `profile`, the profile
- `identity`, the unique identity of the Node associating with the peripheral object that is updated
- `peripheral_type`, the type of peripheral object, e.g. `linux`, `sensorboard`, `ble_sensortag`, ...
- `peripheral_id`, the identity of peripheral object, which is unique under same peripheral type
- `version`, the software/firmware version of the peripheral object
- `state`, the association state (number) between the Node and the Peripheral Object. `1` indicates `configured` but disconnected. `2` indicates `connected` and managed.
- `metadata`, the json object as metadata of the Peripheral Object


## Example

[example01.js](examples/example01.js) is a very small example to demonstrate peripheral object updates. You can run it by:

```text
$ npm install
$ node ./examples/example01.js [username] [password]

...
connecting to https://tic-dm.t2t.io
connected to https://tic-dm.t2t.io (channel: client) via websocket protocol
Jan/06 21:10:35.623 connected
Jan/06 21:10:35.692 authenticated
Jan/06 21:11:54.976 conscious: C99900002/linux_wireless/wlan0
Jan/06 21:11:54.977     version:0.0.0 state:2
Jan/06 21:11:54.977     metadata => {"adapter":{"interface":"wlan0","link":"ethernet","address":"5c:31:3e:e0:6a:7d","ipv6_address":"fe80::5e31:3eff:fee0:6a7d/64","ipv4_address":"192.168.201.7","ipv4_broadcast":"192.168.201.255","ipv4_subnet_mask":"255.255.255.0","up":true,"broadcast":true,"running":true,"multicast":true},"wireless":{"interface":"wlan0","access_point":"34:3d:c4:af:ba:14","frequency":2.412,"ieee":"802.11abgn","mode":"managed","quality":57,"signal":-53,"ssid":"CONSCIOUS-WiFi","access_point_oui":["Buffalo.Inc","AKAMONDORI Bld.,30-20,Ohsu 3-chome,Naka-ku","Nagoya Aichi Pref. 460-8315","Japan"]},"default":true}
Jan/06 21:11:57.533 conscious: C99900001/linux_wireless/wlan1
Jan/06 21:11:57.533     version:0.0.0 state:2
Jan/06 21:11:57.533     metadata => {"adapter":{"interface":"wlan1","link":"ethernet","address":"80:30:dc:2d:5e:fc","up":true,"broadcast":true,"multicast":true},"wireless":{"interface":"wlan1","ieee":"802.11abgn","mode":"managed"},"default":true}
Jan/06 21:14:54.947 conscious: C99900002/linux_wireless/wlan0
Jan/06 21:14:54.947     version:0.0.0 state:2
Jan/06 21:14:54.947     metadata => {"adapter":{"interface":"wlan0","link":"ethernet","address":"5c:31:3e:e0:6a:7d","ipv6_address":"fe80::5e31:3eff:fee0:6a7d/64","ipv4_address":"192.168.201.7","ipv4_broadcast":"192.168.201.255","ipv4_subnet_mask":"255.255.255.0","up":true,"broadcast":true,"running":true,"multicast":true},"wireless":{"interface":"wlan0","access_point":"34:3d:c4:af:ba:14","frequency":2.412,"ieee":"802.11abgn","mode":"managed","quality":57,"signal":-53,"ssid":"CONSCIOUS-WiFi","access_point_oui":["Buffalo.Inc","AKAMONDORI Bld.,30-20,Ohsu 3-chome,Naka-ku","Nagoya Aichi Pref. 460-8315","Japan"]},"default":true}
```

