process.env.NODE_ENV ?= 'development'

_           = require 'underscore'
fs          = require 'fs'
express     = require 'express'

labify      = (require './lib/labify').labify

app = express.createServer()

app.configure ->
  app.use express.static(__dirname + '/public')

activeScripts = (req, res) ->

  fs.readFile (__dirname + '/config/lab.json'), (err, data) ->
    lab_config = JSON.parse data

    loader = '$LAB'
  
    loader += labify 'vendor', lab_config.vendor
    loader += labify 'app', lab_config.app
    loader += ".script('/js/main.js');"
    
    fs.writeFile (__dirname + '/public/js/loader.js'), loader
    
    if process.env.activeReload?
      loader += "$LAB.script('/socket.io/socket.io.js').wait(function(){

        var socket = io.connect('http://localhost');
        socket.on('message', function(m) {
          if (m.source === 'compiler') {
            location.reload();
          }
        });
      })"
  
    res.send loader
  

app.get '/loader.js', (req, res) ->
  res.contentType 'application/javascript'
  if process.env.NODE_ENV is 'production'
    fs.readFile (__dirname + '/public/js/loader.js'), (err, data) ->
      res.send data
  else
    activeScripts req, res


port = process.env.PORT or 3000

app.listen port

active_reload = ->
  io = (require 'socket.io').listen app
  io.set 'log level', 0

  sockets = {}

  io.sockets.on 'connection', (socket) ->
    sockets[socket.id] = socket

  io.sockets.on 'disconnect', (socket) ->
    delete sockets[socket.id]

  process.on 'message', (m) ->
    if m.source is 'compiler' and m.type is 'stdout'
      for key, value of sockets
        value.emit 'message', m

active_reload() if process.env.activeReload?

_.delay ->
  console.log "\nCoolkit Server running at http://localhost:#{port}/"
, 20