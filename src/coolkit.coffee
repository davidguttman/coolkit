fs = require 'fs'
path = require 'path'
exec = (require 'child_process').exec

fileUtil = require 'file'
argv = (require 'optimist').argv

helpers = require './helpers'

class Coolkit
  defaultConfig:
    appPath: './'
  
  constructor: (options) ->
    options = helpers.extend @defaultConfig, options
    @options = options
    
    @package = 
      name: @options.project_name
      version: "0.0.1"
      private: true
      dependencies:
        express: ">= 0"
        underscore: '>= 0'
        'coffee-script': ">= 0"

    
  new: (callback) ->
    templatePath = path.join module.id, '/../../template'
    
    helpers.log "[Coolkit]: Creating new project in #{@options.appPath}... "
    
    path.exists @options.appPath, (exists) =>
      if exists
        helpers.logError "[Coolkit]: can\'t create project -- directory \"#{@options.appPath}\" already exists"
        return
    
      fileUtil.mkdirsSync @options.appPath, 0755
      
      fs.writeFileSync @options.appPath + '/package.json', (JSON.stringify @package, null, 2)
        
      helpers.recursiveCopy templatePath, @options.appPath, =>
        helpers.log "[NPM]: installing dependencies...\n"
        exec 'npm install', {cwd: @options.appPath}, (error, stdout, stderr) =>
          console.log stdout
          
          if stderr? and stderr.length > 0
            helpers.logError "[NPM]: \n" + stderr
          
          if error?
            helpers.logError "[NPM]: \n" + error
          else
            helpers.log "[Coolkit]: created new project \"#{@options.project_name}\"\n"
            
            callback() if callback?

    this
    
    

exports.run = ->
  project_name = argv._[0]
  if project_name?
    jsck = new Coolkit
      project_name: project_name
      appPath: "./#{project_name}"
    jsck.new()
  else
    helpers.logError '[Coolkit]: Please specify a project/directory name.'

