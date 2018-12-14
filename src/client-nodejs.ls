#
# Copyright 2014-2017 T2T Inc. All rights reserved.
#
EE = require \events
SIOC = require \socket.io-client

global.get-logger = (name) ->
  return do
    DBG: console.log
    ERR: console.log
    WARN: console.log
    INFO: console.log

WSC = require 'yapps/lib/classes/web/wss-client-core'


class Skeleton
  (@configs) ->
    return

  set-wssc: (@wssc) ->
    return @configs


class Client extends WSC
  (@server, @name=\smith, @token=null, @opts={}, @verbose=no) ->
    @ee = new EE!
    @rrctx = new Skeleton opts
    # console.log "opts => #{JSON.stringify opts}"
    super SIOC, server, \client, name, token, {}, verbose, @rrctx, {}

  debug: (message) ->
    return unless @verbose
    return console.log "[dm-client]: #{message}"

  at-connected: (ws) ->
    @ee.emit \connected
    return @.debug "connected."

  at-configured: (ws, code, err) ->
    {ws} = self = @
    if code is 0
      @ee.emit \authenticated
      return @.debug "configured/authenticated."
    else
      message = "authentication error, code:#{code}, err: #{err}"
      @ee.emit \error, message
      return @.debug message

  at-disconnected: (ws) ->
    @ee.emit \disconnected
    return @.debug "disconnected."

  process_data_peripheral_updated: (items, profile, identity, peripheral) ->
    {peripheral_type, peripheral_id, version, state, metadata} = peripheral
    @.debug "peripheral_updated: #{profile}/#{identity}/#{peripheral_type}/#{peripheral_id}: version:#{version} state:#{state} metadata=>\n#{JSON.stringify metadata, null, '  '}"
    @ee.emit \peripheral_updated, profile, identity, peripheral_type, peripheral_id, version, state, metadata

  process_data_production_updated: (evts, profile, hostname, idx) ->
    @.debug "production_updated: #{profile}/#{hostname}"
    @ee.emit \production_updated, profile, hostname, idx, evts

  on: (evt, listener) ->
    return @ee.on evt, listener

module.exports = exports = Client