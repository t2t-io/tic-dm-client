(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Client = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (__filename){
// Generated by LiveScript 1.5.0
var ref$, DBG, ERR, WARN, INFO, EVENT_READY, EVENT_CONFIGURED, EVENT_DATA, REQ_CONFIGURE, REQUEST_CHANNEL, RESPONSE_CHANNEL, createRrCommander, exports, WssClient;
ref$ = global.getLogger(__filename), DBG = ref$.DBG, ERR = ref$.ERR, WARN = ref$.WARN, INFO = ref$.INFO;
ref$ = require('./wss-constants'), EVENT_READY = ref$.EVENT_READY, EVENT_CONFIGURED = ref$.EVENT_CONFIGURED, EVENT_DATA = ref$.EVENT_DATA, REQ_CONFIGURE = ref$.REQ_CONFIGURE;
ref$ = require('./wss-helpers'), REQUEST_CHANNEL = ref$.REQUEST_CHANNEL, RESPONSE_CHANNEL = ref$.RESPONSE_CHANNEL, createRrCommander = ref$.createRrCommander;
module.exports = exports = WssClient = (function(){
  WssClient.displayName = 'WssClient';
  var prototype = WssClient.prototype, constructor = WssClient;
  function WssClient(sioc, host, channel, name, token, opts, verbose, rrctx, rrOpts){
    var self, ws, rr;
    this.sioc = sioc;
    this.host = host;
    this.channel = channel;
    this.name = name != null ? name : 'smith';
    this.token = token != null ? token : null;
    this.opts = opts != null
      ? opts
      : {};
    this.verbose = verbose != null ? verbose : false;
    this.rrctx = rrctx != null ? rrctx : null;
    this.rrOpts = rrOpts != null
      ? rrOpts
      : {};
    self = this;
    self.configured = false;
    self.rr = null;
    ws = self.ws = sioc(host + "/" + channel, {
      autoConnect: true
    });
    ws.on('connect', function(){
      return self.atInternalConnected();
    });
    ws.on('disconnect', function(){
      return self.atInternalDisconnected();
    });
    ws.on(EVENT_READY, function(){
      return self.atInternalReady();
    });
    ws.on(EVENT_CONFIGURED, function(p){
      return self.atInternalConfigured(p);
    });
    ws.on(EVENT_DATA, function(p){
      return self.atWsData(p);
    });
    if (rrctx == null) {
      return;
    }
    self.opts.rrctx = rrctx.setWssc(self);
    rr = self.rr = createRrCommander(name, rrOpts, rrctx);
    rr.setOutgoingReq(function(p){
      self.DEBUG("me>>peer[req]: " + JSON.stringify(p));
      return ws.emit(REQUEST_CHANNEL, p);
    });
    rr.setOutgoingRsp(function(p){
      self.DEBUG("me<<peer[rsp]: " + JSON.stringify(p));
      return ws.emit(RESPONSE_CHANNEL, p);
    });
    ws.on(REQUEST_CHANNEL, function(p){
      self.DEBUG("me<<peer[req]: " + JSON.stringify(p));
      return rr.processIncomingReq(p);
    });
    ws.on(RESPONSE_CHANNEL, function(p){
      self.DEBUG("me>>peer[rsp]: " + JSON.stringify(p));
      return rr.processIncomingRsp(p);
    });
  }
  WssClient.prototype.connect = function(done){
    return this.ws.connect(done);
  };
  WssClient.prototype.performReqWithRsp = function(action, args){
    var self, ref$, rr, verbose, done, fs, res$, i$, len$, a, xs;
    args == null && (args = []);
    ref$ = self = this, rr = ref$.rr, verbose = ref$.verbose;
    if (rr == null) {
      return self.ERR("perform-req-with-rsp(): missing request-and-response commander");
    }
    if (!(args.length > 0)) {
      return self.ERR("perform-req-with-rsp(): missing callback");
    }
    done = args.pop();
    if ('function' !== typeof done) {
      return self.ERR("perform-req-with-rsp(): last argument is not callback function");
    }
    if (verbose) {
      res$ = [];
      for (i$ = 0, len$ = args.length; i$ < len$; ++i$) {
        a = args[i$];
        res$.push(JSON.stringify(a));
      }
      fs = res$;
      fs = fs.join(", ");
      self.DEBUG("perform-req-with-rsp(): " + action + "(" + fs.gray + ")");
    }
    xs = [done, action, true].concat(args);
    return rr.performRequest.apply(rr, xs);
  };
  WssClient.prototype.performReqWithoutRsp = function(action, args){
    var self, ref$, rr, verbose, fs, res$, i$, len$, a, xs;
    args == null && (args = []);
    ref$ = self = this, rr = ref$.rr, verbose = ref$.verbose;
    if (rr == null) {
      return self.ERR("perform-req-without-rsp(): missing request-and-response commander");
    }
    if (verbose) {
      res$ = [];
      for (i$ = 0, len$ = args.length; i$ < len$; ++i$) {
        a = args[i$];
        res$.push(JSON.stringify(a));
      }
      fs = res$;
      fs = fs.join(", ");
      self.DEBUG("perform-req-with-rsp(): " + action + "(" + fs.gray + ")");
    }
    xs = [null, action, false].concat(args);
    return rr.performRequest.apply(rr, xs);
  };
  WssClient.prototype.atInternalReady = function(){
    var self, ref$, ws, name, token, opts, args, index;
    ref$ = self = this, ws = ref$.ws, name = ref$.name, token = ref$.token, opts = ref$.opts;
    args = [name, token, opts];
    index = new Date() - 0;
    return ws.emit(REQ_CONFIGURE, {
      index: index,
      args: args
    });
  };
  WssClient.prototype.atInternalConnected = function(){
    var self, ref$, host, channel;
    ref$ = self = this, host = ref$.host, channel = ref$.channel;
    INFO("connected to " + host + " (channel: " + channel + ") via websocket protocol");
    return this.atConnected(this.ws);
  };
  WssClient.prototype.atInternalConfigured = function(p){
    var self, ws, index, code, err;
    ws = (self = this).ws;
    index = p.index, code = p.code, err = p.err;
    self.configured = code === 0;
    self.atConfigured(ws, code, err);
    if (code !== 0) {
      return ws.disconnect();
    }
  };
  WssClient.prototype.atInternalDisconnected = function(){
    var self, ref$, ws, rr;
    ref$ = self = this, ws = ref$.ws, rr = ref$.rr;
    self.configured = false;
    return self.atDisconnected(ws);
  };
  WssClient.prototype.atWsData = function(p){
    var self, ref$, verbose, ws, index, category, items, args, name, f;
    ref$ = self = this, verbose = ref$.verbose, ws = ref$.ws;
    index = p.index, category = p.category, items = p.items, args = p.args;
    if (index == null) {
      return WARN("missing `index` in data event");
    }
    if (category == null) {
      return WARN("missing `category` in data event");
    }
    if (items == null) {
      return WARN("missing `items` in data event");
    }
    name = "process_data_" + category;
    if (args == null) {
      args = [];
    }
    if (!Array.isArray(args)) {
      args = [args];
    }
    if (!Array.isArray(items)) {
      items = [items];
    }
    args = [items].concat(args);
    f = self[name];
    if (f == null) {
      return WARN("missing handler function " + name + " in subclass");
    }
    return f.apply(self, args);
  };
  WssClient.prototype.emitData = function(category, items, args){
    var self, ref$, ws, configured, index;
    ref$ = self = this, ws = ref$.ws, configured = ref$.configured;
    if (!configured) {
      return;
    }
    index = new Date() - 0;
    return ws.emit(EVENT_DATA, {
      index: index,
      category: category,
      items: items,
      args: args
    });
  };
  WssClient.prototype.ERR = function(){
    var self, ref$, verbose, name, index, LOGGER, args, a0, a1, message;
    ref$ = self = this, verbose = ref$.verbose, name = ref$.name, index = ref$.index;
    LOGGER = ERR;
    args = Array.from(arguments);
    a0 = args[0];
    a1 = args[1];
    message = 'object' === typeof a0 ? a1 : a0;
    message = name.green + ": [" + index.gray + "] " + message;
    args = 'object' === typeof a0
      ? [a0, message]
      : [message];
    return LOGGER.apply(null, args);
  };
  WssClient.prototype.DEBUG = function(){
    var self, ref$, verbose, name, channel, LOGGER, args, a0, a1, message;
    ref$ = self = this, verbose = ref$.verbose, name = ref$.name, channel = ref$.channel;
    LOGGER = verbose ? INFO : DBG;
    args = Array.from(arguments);
    a0 = args[0];
    a1 = args[1];
    message = 'object' === typeof a0 ? a1 : a0;
    message = name.green + ": [" + channel.gray + "] " + message;
    args = 'object' === typeof a0
      ? [a0, message]
      : [message];
    return LOGGER.apply(null, args);
  };
  WssClient.prototype.atConnected = function(ws){};
  WssClient.prototype.atDisconnected = function(ws){};
  WssClient.prototype.atConfigured = function(ws, code, err){};
  return WssClient;
}());



}).call(this,"/Users/yagamy/Works/workspaces/t2t/tic-dm-client/externals/yapps/lib/classes/web/wss-client-core.ls")
},{"./wss-constants":2,"./wss-helpers":3}],2:[function(require,module,exports){
// Generated by LiveScript 1.5.0
var EVENT_READY, EVENT_CONFIGURED, EVENT_DATA, REQ_CONFIGURE, exports;
EVENT_READY = 'ready';
EVENT_CONFIGURED = 'configured';
EVENT_DATA = 'data';
REQ_CONFIGURE = 'configure';
module.exports = exports = {
  EVENT_READY: EVENT_READY,
  EVENT_CONFIGURED: EVENT_CONFIGURED,
  EVENT_DATA: EVENT_DATA,
  REQ_CONFIGURE: REQ_CONFIGURE
};



},{}],3:[function(require,module,exports){
(function (__filename){
// Generated by LiveScript 1.5.0
var ref$, DBG, ERR, WARN, INFO, INDEX_SEPARATOR, TASK_EXPIRATION_PERIOD, RaR_Impl, RaR, REQUEST_CHANNEL, RESPONSE_CHANNEL, createRrCommander, exports;
ref$ = global.getLogger(__filename), DBG = ref$.DBG, ERR = ref$.ERR, WARN = ref$.WARN, INFO = ref$.INFO;
INDEX_SEPARATOR = "_";
TASK_EXPIRATION_PERIOD = 30;
RaR_Impl = (function(){
  RaR_Impl.displayName = 'RaR_Impl';
  var prototype = RaR_Impl.prototype, constructor = RaR_Impl;
  function RaR_Impl(name, opts, context){
    var self, f;
    this.name = name;
    this.opts = opts;
    this.context = context;
    self = this;
    self.outgoingTasks = {};
    self.outgoingCounter = 0;
    self.incomingTasks = {};
    self.incomingCounter = 0;
    f = function(){
      return self.atTimeout();
    };
    self.timer = setInterval(f, 1000);
    return;
  }
  RaR_Impl.prototype.clear = function(){
    var self, timer;
    timer = (self = this).timer;
    return clearInterval(timer);
  };
  RaR_Impl.prototype.setOutgoingReq = function(sendReq){
    this.sendReq = sendReq;
  };
  RaR_Impl.prototype.setOutgoingRsp = function(sendRsp){
    this.sendRsp = sendRsp;
  };
  RaR_Impl.prototype.processIncomingReq = function(packet){
    var self, ref$, name, context, incomingTasks, index, action, response, args, text, now, func, dummy, ds, done, task;
    ref$ = self = this, name = ref$.name, context = ref$.context, incomingTasks = ref$.incomingTasks;
    index = packet.index, action = packet.action, response = packet.response, args = packet.args;
    if (response == null) {
      response = false;
    }
    if (args == null) {
      args = [];
    }
    text = JSON.stringify(packet).gray;
    if (index == null) {
      return WARN("[" + name + "] process-request-packet(): missing index => " + text);
    }
    if (action == null) {
      return self.responseError(index, "missing action => " + text);
    }
    if (!Array.isArray(args)) {
      return self.responseError(index, "invalid args for " + action + " => " + text);
    }
    now = new Date();
    func = context[action];
    if (func == null) {
      return self.responseError(index, "missing handler for action[" + action + "]");
    }
    dummy = function(error, result){};
    ds = [dummy].concat(args);
    if (!response) {
      return func.apply(context, ds);
    }
    done = function(error, result){
      return self.postprocessRequest(index, action, args, error, result);
    };
    ds = [done].concat(args);
    task = {
      packet: packet,
      start: now,
      expire: TASK_EXPIRATION_PERIOD,
      inOrOut: 'incoming'
    };
    incomingTasks[index] = task;
    return func.apply(context, ds);
  };
  RaR_Impl.prototype.processIncomingRsp = function(packet){
    var self, ref$, name, outgoingTasks, index, error, result, text, t, done;
    ref$ = self = this, name = ref$.name, outgoingTasks = ref$.outgoingTasks;
    index = packet.index, error = packet.error, result = packet.result;
    text = JSON.stringify(packet).gray;
    if (index == null) {
      return WARN("[" + name + "] process-response-packet(): missing index => " + text);
    }
    t = outgoingTasks[index];
    if (t == null) {
      return WARN("[" + name + "] tasks[" + index + "] => too late since task is deleted");
    }
    delete outgoingTasks[index];
    done = t.done;
    return done(error, result);
  };
  RaR_Impl.prototype.responseError = function(index, error){
    var self, sendRsp, packet;
    sendRsp = (self = this).sendRsp;
    packet = {
      index: index,
      result: null,
      error: error
    };
    return sendRsp(packet);
  };
  RaR_Impl.prototype.responseOkay = function(index, result){
    var self, sendRsp, packet;
    sendRsp = (self = this).sendRsp;
    packet = {
      index: index,
      result: result,
      error: null
    };
    return sendRsp(packet);
  };
  RaR_Impl.prototype.postprocessRequest = function(index, action, args, error, result){
    var self, ref$, name, incomingTasks, t;
    ref$ = self = this, name = ref$.name, incomingTasks = ref$.incomingTasks;
    t = incomingTasks[index];
    if (t == null) {
      return WARN("[" + name + "] " + action + "::" + index + " => too late since task is deleted");
    }
    delete incomingTasks[index];
    if (error != null) {
      return self.responseError(index, error);
    }
    return self.responseOkay(index, result);
  };
  RaR_Impl.prototype.getNextOutgoingCounter = function(){
    this.outgoingCounter = this.outgoingCounter + 1;
    return this.outgoingCounter;
  };
  RaR_Impl.prototype.getNextIncomingCounter = function(){
    this.incomingCounter = this.incomingCounter + 1;
    return this.incomingCounter;
  };
  RaR_Impl.prototype.performRequest = function(done, action, response){
    var args, res$, i$, to$, self, ref$, sendReq, outgoingTasks, counter, now, index, packet, task;
    res$ = [];
    for (i$ = 3, to$ = arguments.length; i$ < to$; ++i$) {
      res$.push(arguments[i$]);
    }
    args = res$;
    ref$ = self = this, sendReq = ref$.sendReq, outgoingTasks = ref$.outgoingTasks;
    counter = self.getNextOutgoingCounter();
    now = new Date();
    index = now - 0;
    index = index + "" + INDEX_SEPARATOR + counter;
    packet = {
      index: index,
      action: action,
      response: response,
      args: args
    };
    task = {
      packet: packet,
      start: now,
      done: done,
      expire: TASK_EXPIRATION_PERIOD,
      inOrOut: 'outgoing'
    };
    if (!response) {
      return sendReq(packet);
    }
    outgoingTasks[index] = task;
    return sendReq(packet);
  };
  RaR_Impl.prototype.handleExpiredOutgoingTask = function(index, task){
    var done, packet, action, args;
    done = task.done, packet = task.packet;
    action = packet.action, args = packet.args;
    return done(action + "[" + index + "] with args (" + JSON.stringify(args) + ") is expired", null);
  };
  RaR_Impl.prototype.handleExpiredIncomingTask = function(index, task){
    return this.responseError(index, "expired");
  };
  RaR_Impl.prototype.reviewTasks = function(tasks, func){
    var self, expiredTasks, index, task, start, inOrOut, packet, action, args, ref$, results$ = [];
    self = this;
    expiredTasks = self.decreaseTaskTimerCounter(tasks);
    for (index in expiredTasks) {
      task = expiredTasks[index];
      start = task.start, inOrOut = task.inOrOut, packet = task.packet;
      action = packet.action, args = packet.args;
      WARN(inOrOut + ":" + action + "[" + index + "] with args (" + JSON.stringify(args) + ") is expired");
      func.apply(self, [index, task]);
      results$.push((ref$ = tasks[index], delete tasks[index], ref$));
    }
    return results$;
  };
  RaR_Impl.prototype.atTimeout = function(){
    var self, ref$, incomingTasks, outgoingTasks;
    ref$ = self = this, incomingTasks = ref$.incomingTasks, outgoingTasks = ref$.outgoingTasks;
    self.reviewTasks(incomingTasks, self.handleExpiredIncomingTask);
    return self.reviewTasks(outgoingTasks, self.handleExpiredOutgoingTask);
  };
  RaR_Impl.prototype.decreaseTaskTimerCounter = function(tasks){
    var index, t;
    for (index in tasks) {
      t = tasks[index];
      t.expire = t.expire - 1;
    }
    return (function(){
      var ref$, resultObj$ = {};
      for (index in ref$ = tasks) {
        t = ref$[index];
        if (t.expire <= 0) {
          resultObj$[index] = t;
        }
      }
      return resultObj$;
    }());
  };
  return RaR_Impl;
}());
RaR = (function(){
  RaR.displayName = 'RaR';
  var prototype = RaR.prototype, constructor = RaR;
  function RaR(name, opts, context){
    this.name = name;
    this.opts = opts;
    this.context = context;
    this.implementation = new RaR_Impl(name, opts, context);
  }
  RaR.prototype.clear = function(){
    return this.implementation.clear();
  };
  RaR.prototype.setOutgoingReq = function(sendReq){
    return this.implementation.setOutgoingReq(sendReq);
  };
  RaR.prototype.setOutgoingRsp = function(sendRsp){
    return this.implementation.setOutgoingRsp(sendRsp);
  };
  RaR.prototype.processIncomingReq = function(packet){
    return this.implementation.processIncomingReq(packet);
  };
  RaR.prototype.processIncomingRsp = function(packet){
    return this.implementation.processIncomingRsp(packet);
  };
  RaR.prototype.performRequest = function(done, action, response){
    var args, res$, i$, to$;
    res$ = [];
    for (i$ = 3, to$ = arguments.length; i$ < to$; ++i$) {
      res$.push(arguments[i$]);
    }
    args = res$;
    return this.implementation.performRequest.apply(this.implementation, arguments);
  };
  return RaR;
}());
REQUEST_CHANNEL = 'request';
RESPONSE_CHANNEL = 'response';
createRrCommander = function(name, opts, context){
  return new RaR(name, opts, context);
};
module.exports = exports = {
  createRrCommander: createRrCommander,
  REQUEST_CHANNEL: REQUEST_CHANNEL,
  RESPONSE_CHANNEL: RESPONSE_CHANNEL
};



}).call(this,"/Users/yagamy/Works/workspaces/t2t/tic-dm-client/externals/yapps/lib/classes/web/wss-helpers.ls")
},{}],4:[function(require,module,exports){
// Generated by LiveScript 1.5.0
var EE, SIOC, WSC, Skeleton, Client, exports;
EE = require('events');
SIOC = require('socket.io-client');
global.getLogger = function(name){
  return {
    DBG: console.log,
    ERR: console.log,
    WARN: console.log,
    INFO: console.log
  };
};
WSC = require('../externals/yapps/lib/classes/web/wss-client-core');
Skeleton = (function(){
  Skeleton.displayName = 'Skeleton';
  var prototype = Skeleton.prototype, constructor = Skeleton;
  function Skeleton(configs){
    this.configs = configs;
    return;
  }
  Skeleton.prototype.setWssc = function(wssc){
    this.wssc = wssc;
    return this.configs;
  };
  return Skeleton;
}());
Client = (function(superclass){
  var prototype = extend$((import$(Client, superclass).displayName = 'Client', Client), superclass).prototype, constructor = Client;
  function Client(server, name, token, opts, verbose){
    this.server = server;
    this.name = name != null ? name : 'smith';
    this.token = token != null ? token : null;
    this.opts = opts != null
      ? opts
      : {};
    this.verbose = verbose != null ? verbose : false;
    this.ee = new EE();
    this.rrctx = new Skeleton(opts);
    Client.superclass.call(this, SIOC, server, 'client', name, token, {}, verbose, this.rrctx, {});
  }
  Client.prototype.debug = function(message){
    if (!this.verbose) {
      return;
    }
    return console.log("[dm-client]: " + message);
  };
  Client.prototype.atConnected = function(ws){
    this.ee.emit('connected');
    return this.debug("connected.");
  };
  Client.prototype.atConfigured = function(ws, code, err){
    var self, message;
    ws = (self = this).ws;
    if (code === 0) {
      this.ee.emit('authenticated');
      return this.debug("configured/authenticated.");
    } else {
      message = "authentication error, code:" + code + ", err: " + err;
      this.ee.emit('error', message);
      return this.debug(message);
    }
  };
  Client.prototype.atDisconnected = function(ws){
    this.ee.emit('disconnected');
    return this.debug("disconnected.");
  };
  Client.prototype.process_data_peripheral_updated = function(items, profile, identity, peripheral){
    var peripheral_type, peripheral_id, version, state, metadata;
    peripheral_type = peripheral.peripheral_type, peripheral_id = peripheral.peripheral_id, version = peripheral.version, state = peripheral.state, metadata = peripheral.metadata;
    this.debug("peripheral_updated: " + profile + "/" + identity + "/" + peripheral_type + "/" + peripheral_id + ": version:" + version + " state:" + state + " metadata=>\n" + JSON.stringify(metadata, null, '  '));
    return this.ee.emit('peripheral_updated', profile, identity, peripheral_type, peripheral_id, version, state, metadata);
  };
  Client.prototype.on = function(evt, listener){
    return this.ee.on(evt, listener);
  };
  return Client;
}(WSC));
module.exports = exports = Client;
function extend$(sub, sup){
  function fun(){} fun.prototype = (sub.superclass = sup).prototype;
  (sub.prototype = new fun).constructor = sub;
  if (typeof sup.extended == 'function') sup.extended(sub);
  return sub;
}
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}



},{"../externals/yapps/lib/classes/web/wss-client-core":1,"events":undefined,"socket.io-client":"socket.io-client"}]},{},[4])(4)
});