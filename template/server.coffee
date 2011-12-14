_ = require 'underscore'
fs = require 'fs'
express = require 'express'

labify = (require './lib/labify').labify

app = express.createServer()
app.configure ->
  app.use express.static(__dirname + '/public')

app.get '/loader.js', (req, res) ->
  res.contentType 'application/javascript'
  
  lab_config = JSON.parse (fs.readFileSync (__dirname + '/config/lab.json'))

  loader = '$LAB'
  
  loader += labify 'vendor', lab_config.vendor
  loader += labify 'config', lab_config.config
  loader += labify 'app', lab_config.app
  
  loader += ".script('/js/main.js');"
  
  res.send loader

port = process.env.PORT or 3000

app.listen port

console.log "Coolkit Server running at http://localhost:#{port}/"