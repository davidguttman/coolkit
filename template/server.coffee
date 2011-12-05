_ = require 'underscore'
fs = require 'fs'
glob = require 'glob'
express = require 'express'

labify = (js_dir, config) ->
  js_prefix = '/js/'  
  file_prefix = js_prefix + "#{js_dir}/"

  loader = ''

  # file_list = fs.readdirSync (__dirname + 'public' + file_prefix + '**/*.js')
  # file_list = glob.globSync (__dirname + 'public' + file_prefix + '**/*.js'), "GLOB_STAR"
  file_list = glob.globSync (__dirname + '/public' + file_prefix + '**/*.js'), glob.GLOB_STAR

  console.log "file_list", file_list

  files = _.map file_list, (filename) ->
    console.log "filename", filename
    regex = new RegExp "^.*#{'public' + file_prefix}"
    filename = filename.replace regex, ''
    console.log "filename", filename
    return filename

  if config?
    if config.noload?
      files = _.filter files, (filename) ->
        !_.detect config.noload, (no_load_filename) ->
          no_load_filename is filename

    if config.order?
      _.each config.order, (filename) ->
        loader += ".script('#{file_prefix}#{filename}').wait()"
      
      files = _.filter files, (filename) ->
        !_.detect config.order, (order_filename) ->
          order_filename is filename
  
  _.each files, (filename) ->
    loader += ".script('#{file_prefix}#{filename}')"

  loader += '.wait()'

app = express.createServer()
app.configure ->
  app.use express.static(__dirname + '/public')

app.get '/loader.js', (req, res) ->
  # res.contentType 'application/javascript'
  
  lab_config = JSON.parse (fs.readFileSync (__dirname + '/config/lab.json'))

  loader = '$LAB'
  
  loader += labify 'vendor', lab_config.vendor
  loader += labify 'config', lab_config.config
  loader += labify 'app', lab_config.app
  
  loader += ".script('/js/main.js');"
  
  res.send loader

app.listen 3000

console.log "JSCoolkit Server running at http://localhost:3000/"