{spawn, exec, fork}   = require 'child_process'
util                  = require 'util'
path                  = require 'path'

active = ->
  runCommand = (name, args...) ->
    proc =           spawn name, args
  
    proc.stdout.on   'data', (buffer) -> 
      message = buffer.toString()
      message = message.replace /\s+$/g, ''
      console.log message
  
    proc.stderr.on   'data', (buffer) -> 
      message = buffer.toString()
      message = message.replace /\s+$/g, ''
      console.log message
        
    proc.on 'exit', (status) -> process.exit(1) if status isnt 0
    proc

  cake = runCommand 'cake', 'active'
  
  process.on 'exit', ->
    cake.kill()
  
  
  
module.exports = active