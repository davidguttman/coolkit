fs        = require 'fs'
path      = require 'path'
exec      = (require 'child_process').exec
util      = require 'util'

_         = require 'underscore'
async     = require 'async'
fileUtil  = require 'file'
argv      = (require 'optimist').argv

helpers   = require './helpers'


class Coolkit
  defaultConfig:
    appPath: './'
  
  constructor: (options) ->
    _.bindAll this
    
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

    
  new: ->
    templatePath = path.join module.id, '/../../template'
    
    helpers.log "[Coolkit]: Creating new project in #{@options.appPath}... "
    
    path.exists @options.appPath, (exists) =>
      if exists
        helpers.logError "[Coolkit]: can\'t create project -- directory \"#{@options.appPath}\" already exists"
        return
    
      fileUtil.mkdirsSync @options.appPath, 0755
      
      fs.writeFileSync @options.appPath + '/package.json', (JSON.stringify @package, null, 2)
        
      helpers.recursiveCopy templatePath, @options.appPath, @installDependencies

    this
  
  installDependencies: ->
    helpers.log "[NPM]: installing dependencies...\n"
    exec 'npm install', {cwd: @options.appPath}, (error, stdout, stderr) =>
      console.log stdout
      
      if stderr? and stderr.length > 0
        helpers.logError "[NPM]: \n" + stderr
      
      if error?
        helpers.logError "[NPM]: \n" + error
      else
        helpers.log "[Coolkit]: created new project \"#{@options.project_name}\"\n"

command_opts =
  new: 
    help: "Creates a new Coolkit project with the name you specify. Example:\n\tcoolkit new project_name"
    
    execute: (project_name) ->
      if project_name?
        ck = new Coolkit
          project_name: project_name
          appPath: "./#{project_name}"
        ck.new()
      else
       helpers.logError '[Coolkit]: Please specify a project/directory name.'
  
    

exports.run = ->
  command = argv._[0]
  command_arg = argv._[1]
  
  if command_opts[command]?
    command_opts[command].execute command_arg
  else
    helpers.logError "[Coolkit]: Invalid or unspecified command. Available commands:"
    for name, info of command_opts
      util.puts "#{name}: #{info.help}"
