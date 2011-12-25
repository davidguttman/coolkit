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
    templatePath: path.join module.id, '/../../template'
  
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
        "socket.io": ">= 0"

    
  new: ->
    methods = [
      @createProjectDir
      @installDependencies
      @initGit
    ]
    
    async.waterfall methods, (error) =>
      if error?
        helpers.logError error
      else
        helpers.log "[Coolkit]: Project \"#{@options.project_name}\" created successfully"
    
    this
  
  createProjectDir: (callback) ->
    helpers.log "[Coolkit]: Creating new project in #{@options.appPath}... "
    
    path.exists @options.appPath, (exists) =>
      if exists
        error = "[Coolkit]: Can't create project -- directory \"#{@options.appPath}\" already exists"
        callback error
      else
    
        fileUtil.mkdirsSync @options.appPath, 0755
      
        fs.writeFileSync @options.appPath + '/package.json', (JSON.stringify @package, null, 2)
        
        helpers.recursiveCopy @options.templatePath, @options.appPath, (error) ->
          callback error
  
  initGit: (callback) ->
    helpers.log "[Git]: initializing repo..."
    exec 'git init', {cwd: @options.appPath}, (error, stdout, stderr) =>
      console.log stdout
      
      if stderr? and stderr.length > 0
        helpers.logError "[Git]: \n" + stderr

      callback error
    
  
  installDependencies: (callback) ->
    helpers.log "[NPM]: installing dependencies...\n"
    exec 'npm install', {cwd: @options.appPath}, (error, stdout, stderr) =>
      console.log stdout
      
      if stderr? and stderr.length > 0
        helpers.logError "[NPM]: \n" + stderr

      callback error

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
