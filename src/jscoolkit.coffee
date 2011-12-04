path = require 'path'
fileUtil = require 'file'
argv = (require 'optimist').argv

helpers = require './helpers'

class JSCoolkit
  defaultConfig:
    appPath: './'
  
  constructor: (options) ->
    options = helpers.extend @defaultConfig, options
    @options = options
    
  new: (callback) ->
    templatePath = path.join module.id, '/../../template'
    console.log "@options.appPath", @options.appPath
    path.exists @options.appPath, (exists) =>
      if exists
        helpers.logError "[JSCoolkit]: can\'t create project -- directory \"#{@options.appPath}\" already exists"
        return
    
      fileUtil.mkdirsSync @options.appPath, 0755
    
      helpers.recursiveCopy templatePath, @options.appPath, =>
        helpers.log "[JSCoolkit]: created new project \"#{@options.project_name}\""
        callback() if callback?
    this
    
    

exports.run = ->
  project_name = argv._[0]
  if project_name?
    jsck = new JSCoolkit
      project_name: project_name
      appPath: "./#{project_name}"
    jsck.new()
  else
    helpers.logError '[JSCoolkit]: Please specify a project/directory name.'

