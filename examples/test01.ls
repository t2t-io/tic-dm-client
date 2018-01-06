#!/usr/bin/env lsc
#
#------------------------------------------
# TEST PURPOSE
#     Test request-and-response commander.
#
#
Client = require \..

ERR_EXIT = (message, code=1) ->
  console.log message
  return process.exit code

OK_EXIT = (message, ms=1000) ->
  console.log message
  console.log "PASS!!"
  return process.exit 0

opts =
  cc: 12

[lsc, entry, username, password] = process.argv
ERR_EXIT "missing username as 1st argument" unless username?
ERR_EXIT "missing password as 2nd argument" unless password?

c = new Client \http://localhost:7060, username, password, opts, yes
c.connect!
