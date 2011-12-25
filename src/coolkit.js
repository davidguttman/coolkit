(function() {
  var Coolkit, active, argv, async, command_opts, exec, fileUtil, fs, helpers, path, util, _;

  fs = require('fs');

  path = require('path');

  exec = (require('child_process')).exec;

  util = require('util');

  _ = require('underscore');

  async = require('async');

  fileUtil = require('file');

  argv = (require('optimist')).argv;

  helpers = require('./helpers');

  active = require('./active');

  Coolkit = (function() {

    Coolkit.prototype.defaultConfig = {
      appPath: './',
      templatePath: path.join(module.id, '/../../template')
    };

    function Coolkit(options) {
      _.bindAll(this);
      options = helpers.extend(this.defaultConfig, options);
      this.options = options;
      this.package = {
        name: this.options.project_name,
        version: "0.0.1",
        private: true,
        dependencies: {
          express: ">= 0",
          underscore: '>= 0',
          'coffee-script': ">= 0",
          "socket.io": ">= 0"
        }
      };
    }

    Coolkit.prototype["new"] = function() {
      var methods,
        _this = this;
      methods = [this.createProjectDir, this.installDependencies, this.initGit];
      async.waterfall(methods, function(error) {
        if (error != null) {
          return helpers.logError(error);
        } else {
          return helpers.log("[Coolkit]: Project \"" + _this.options.project_name + "\" created successfully");
        }
      });
      return this;
    };

    Coolkit.prototype.createProjectDir = function(callback) {
      var _this = this;
      helpers.log("[Coolkit]: Creating new project in " + this.options.appPath + "... ");
      return path.exists(this.options.appPath, function(exists) {
        var error;
        if (exists) {
          error = "[Coolkit]: Can't create project -- directory \"" + _this.options.appPath + "\" already exists";
          return callback(error);
        } else {
          fileUtil.mkdirsSync(_this.options.appPath, 0755);
          fs.writeFileSync(_this.options.appPath + '/package.json', JSON.stringify(_this.package, null, 2));
          return helpers.recursiveCopy(_this.options.templatePath, _this.options.appPath, function(error) {
            return callback(error);
          });
        }
      });
    };

    Coolkit.prototype.initGit = function(callback) {
      var _this = this;
      helpers.log("[Git]: initializing repo...");
      return exec('git init', {
        cwd: this.options.appPath
      }, function(error, stdout, stderr) {
        console.log(stdout);
        if ((stderr != null) && stderr.length > 0) {
          helpers.logError("[Git]: \n" + stderr);
        }
        return callback(error);
      });
    };

    Coolkit.prototype.installDependencies = function(callback) {
      var _this = this;
      helpers.log("[NPM]: installing dependencies...\n");
      return exec('npm install', {
        cwd: this.options.appPath
      }, function(error, stdout, stderr) {
        console.log(stdout);
        if ((stderr != null) && stderr.length > 0) {
          helpers.logError("[NPM]: \n" + stderr);
        }
        return callback(error);
      });
    };

    return Coolkit;

  })();

  command_opts = {
    "new": {
      help: "Creates a new Coolkit project with the name you specify. Example:\n\t    $ coolkit new project_name",
      execute: function(project_name) {
        var ck;
        if (project_name != null) {
          ck = new Coolkit({
            project_name: project_name,
            appPath: "./" + project_name
          });
          return ck["new"]();
        } else {
          return helpers.logError('[Coolkit]: Please specify a project/directory name.');
        }
      }
    },
    active: {
      help: "Starts 'active' mode. Coolkit will auto-compile CoffeeScript, start a webserver, and reload the browser when changes are detected. Example:\n\t    $ coolkit active",
      execute: function() {
        var _this = this;
        return path.exists('./server.js', function(exists) {
          if (exists) {
            helpers.log("[Coolkit]: Starting 'Active' Mode...");
            return active();
          } else {
            return helpers.logError("[Coolkit]: Error: './server.js' not found. Is this a Coolkit project directory?");
          }
        });
      }
    }
  };

  exports.run = function() {
    var command, command_arg, info, name, _results;
    command = argv._[0];
    command_arg = argv._[1];
    if (command_opts[command] != null) {
      return command_opts[command].execute(command_arg);
    } else {
      helpers.logError("[Coolkit]: Invalid or unspecified command. Available commands:");
      _results = [];
      for (name in command_opts) {
        info = command_opts[name];
        _results.push(util.puts("" + name + ": " + info.help));
      }
      return _results;
    }
  };

}).call(this);
