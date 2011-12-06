_ = require 'underscore'
fs = require 'fs'

labify = (js_dir, config) ->
  js_prefix = '/js/'  
  file_prefix = js_prefix + "#{js_dir}/"

  load_path = __dirname + '/../public' + file_prefix

  loader = ''

  file_list = _.filter (fs.readdirSync load_path), (filename) ->
    filename.match /\.js$/

  files = _.map file_list, (filename) ->
    regex = new RegExp "^.*#{'public' + file_prefix}"
    filename = filename.replace regex, ''
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

exports.labify = labify