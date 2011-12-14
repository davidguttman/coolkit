(function() {
  var JSCoolkit, argv, exec, fileUtil, fs, helpers, path;

  fs = require('fs');

  path = require('path');

  exec = (require('child_process')).exec;

  fileUtil = require('file');

  argv = (require('optimist')).argv;

  helpers = require('./helpers');

  JSCoolkit = (function() {

    JSCoolkit.prototype.defaultConfig = {
      appPath: './'
    };

    function JSCoolkit(options) {
      options = helpers.extend(this.defaultConfig, options);
      this.options = options;
      this.package = {
        name: this.options.project_name,
        version: "0.0.1",
        private: true,
        dependencies: {
          express: ">= 0",
          underscore: '>= 0',
          'coffee-script': ">= 0"
        }
      };
    }

    JSCoolkit.prototype["new"] = function(callback) {
      var templatePath;
      var _this = this;
      templatePath = path.join(module.id, '/../../template');
      helpers.log("[JSCoolkit]: Creating new project in " + this.options.appPath + "... ");
      path.exists(this.options.appPath, function(exists) {
        if (exists) {
          helpers.logError("[JSCoolkit]: can\'t create project -- directory \"" + _this.options.appPath + "\" already exists");
          return;
        }
        fileUtil.mkdirsSync(_this.options.appPath, 0755);
        fs.writeFileSync(_this.options.appPath + '/package.json', JSON.stringify(_this.package, null, 2));
        return helpers.recursiveCopy(templatePath, _this.options.appPath, function() {
          helpers.log("[NPM]: installing dependencies...\n");
          return exec('npm install', {
            cwd: _this.options.appPath
          }, function(error, stdout, stderr) {
            console.log(stdout);
            if ((stderr != null) && stderr.length > 0) {
              helpers.logError("[NPM]: \n" + stderr);
            }
            if (error != null) {
              return helpers.logError("[NPM]: \n" + error);
            } else {
              helpers.log("[JSCoolkit]: created new project \"" + _this.options.project_name + "\"\n");
              if (callback != null) return callback();
            }
          });
        });
      });
      return this;
    };

    return JSCoolkit;

  })();

  exports.run = function() {
    var jsck, project_name;
    project_name = argv._[0];
    if (project_name != null) {
      jsck = new JSCoolkit({
        project_name: project_name,
        appPath: "./" + project_name
      });
      return jsck["new"]();
    } else {
      return helpers.logError('[JSCoolkit]: Please specify a project/directory name.');
    }
  };

}).call(this);
